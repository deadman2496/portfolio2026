import { createHash, createHmac } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

type StudioMediaStorageMode = "local" | "s3";

type StudioMediaUploadInput = {
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

type StudioMediaUploadResult = {
  url: string;
  fileName: string;
  storage: StudioMediaStorageMode;
  key?: string;
};

const fallbackUploadDir = path.join(process.cwd(), "public", "studio-uploads");

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for Studio S3 media storage.`);
  }

  return value;
}

function getStudioMediaStorageMode(): StudioMediaStorageMode {
  return process.env.STUDIO_MEDIA_STORAGE === "s3" ? "s3" : "local";
}

function getUploadDir() {
  return process.env.STUDIO_UPLOAD_DIR ?? fallbackUploadDir;
}

function getPublicUploadBaseUrl() {
  return process.env.STUDIO_PUBLIC_UPLOAD_BASE_URL ?? "/studio-uploads";
}

function getS3UploadPrefix() {
  return trimSlashes(process.env.OVH_S3_UPLOAD_PREFIX ?? "studio-uploads");
}

function getS3ObjectKey(fileName: string) {
  const prefix = getS3UploadPrefix();

  if (!prefix) {
    return fileName;
  }

  return `${prefix}/${fileName}`;
}

function encodeObjectKey(key: string) {
  return key.split("/").map(encodeURIComponent).join("/");
}

function getS3PublicBaseUrl() {
  const explicitPublicBaseUrl = process.env.OVH_S3_PUBLIC_BASE_URL?.trim();

  if (explicitPublicBaseUrl) {
    return trimTrailingSlash(explicitPublicBaseUrl);
  }

  const endpoint = trimTrailingSlash(getRequiredEnv("OVH_S3_ENDPOINT"));
  const bucket = getRequiredEnv("OVH_S3_BUCKET");

  return `${endpoint}/${bucket}`;
}

function hashHex(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(key: Buffer | string, value: string, encoding?: "hex") {
  const digest = createHmac("sha256", key).update(value).digest();

  if (encoding === "hex") {
    return digest.toString("hex");
  }

  return digest;
}

function getSigningKey(
  secretAccessKey: string,
  dateStamp: string,
  region: string,
) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp) as Buffer;
  const regionKey = hmac(dateKey, region) as Buffer;
  const serviceKey = hmac(regionKey, "s3") as Buffer;

  return hmac(serviceKey, "aws4_request") as Buffer;
}

function getAmzDateParts(date = new Date()) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "");

  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8),
  };
}

function buildCanonicalHeaders(headers: Record<string, string>) {
  const signedHeaderNames = Object.keys(headers)
    .map((name) => name.toLowerCase())
    .sort();

  const canonicalHeaders = signedHeaderNames
    .map((name) => `${name}:${headers[name].trim()}\n`)
    .join("");

  return {
    canonicalHeaders,
    signedHeaders: signedHeaderNames.join(";"),
  };
}

function getS3UploadUrl(bucket: string, key: string) {
  const endpoint = trimTrailingSlash(getRequiredEnv("OVH_S3_ENDPOINT"));
  const encodedKey = encodeObjectKey(key);

  return new URL(`${endpoint}/${bucket}/${encodedKey}`);
}

function getS3SignedHeaders({
  uploadUrl,
  key,
  contentType,
  buffer,
}: {
  uploadUrl: URL;
  key: string;
  contentType: string;
  buffer: Buffer;
}) {
  const accessKeyId = getRequiredEnv("OVH_S3_ACCESS_KEY_ID");
  const secretAccessKey = getRequiredEnv("OVH_S3_SECRET_ACCESS_KEY");
  const region = getRequiredEnv("OVH_S3_REGION");
  const bucket = getRequiredEnv("OVH_S3_BUCKET");

  const { amzDate, dateStamp } = getAmzDateParts();
  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const payloadHash = hashHex(buffer);
  const canonicalUri = `/${bucket}/${encodeObjectKey(key)}`;

  const headers: Record<string, string> = {
    "cache-control": "public, max-age=31536000, immutable",
    "content-type": contentType,
    host: uploadUrl.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };

  const configuredAcl = process.env.OVH_S3_ACL?.trim();

  if (configuredAcl) {
    headers["x-amz-acl"] = configuredAcl;
  }

  const { canonicalHeaders, signedHeaders } = buildCanonicalHeaders(headers);

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    hashHex(canonicalRequest),
  ].join("\n");

  const signingKey = getSigningKey(secretAccessKey, dateStamp, region);
  const signature = hmac(signingKey, stringToSign, "hex");

  return {
    ...headers,
    authorization: [
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(", "),
  };
}

async function uploadStudioMediaToLocal({
  fileName,
  buffer,
}: StudioMediaUploadInput): Promise<StudioMediaUploadResult> {
  const uploadDir = getUploadDir();

  await mkdir(uploadDir, {
    recursive: true,
  });

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return {
    url: `${trimTrailingSlash(getPublicUploadBaseUrl())}/${fileName}`,
    fileName,
    storage: "local",
  };
}

async function uploadStudioMediaToS3({
  fileName,
  contentType,
  buffer,
}: StudioMediaUploadInput): Promise<StudioMediaUploadResult> {
  const bucket = getRequiredEnv("OVH_S3_BUCKET");
  const key = getS3ObjectKey(fileName);
  const uploadUrl = getS3UploadUrl(bucket, key);

  const headers = getS3SignedHeaders({
    uploadUrl,
    key,
    contentType,
    buffer,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: buffer as unknown as BodyInit,
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => "");

    throw new Error(
      `S3 upload failed with ${response.status}: ${responseText.slice(0, 300)}`,
    );
  }

  return {
    url: `${getS3PublicBaseUrl()}/${encodeObjectKey(key)}`,
    fileName,
    key,
    storage: "s3",
  };
}

export async function uploadStudioMedia(
  input: StudioMediaUploadInput,
): Promise<StudioMediaUploadResult> {
  const storageMode = getStudioMediaStorageMode();

  if (storageMode === "s3") {
    return uploadStudioMediaToS3(input);
  }

  return uploadStudioMediaToLocal(input);
}