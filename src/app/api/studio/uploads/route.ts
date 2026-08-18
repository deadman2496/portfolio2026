import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  isStudioAuthorized,
  studioUnauthorizedResponse,
} from "@/lib/studio/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackUploadDir = path.join(process.cwd(), "public", "studio-uploads");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

function getFileExtension(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "video/mp4":
      return "mp4";
    case "video/webm":
      return "webm";
    default:
      return "bin";
  }
}

function getUploadDir() {
  return process.env.STUDIO_UPLOAD_DIR ?? fallbackUploadDir;
}

function getPublicUploadBaseUrl() {
  return process.env.STUDIO_PUBLIC_UPLOAD_BASE_URL ?? "/studio-uploads";
}

export async function POST(request: Request) {
  if (!isStudioAuthorized(request)) {
    return studioUnauthorizedResponse();
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      {
        error: "Missing media file.",
      },
      {
        status: 400,
      },
    );
  }

  if (!allowedMimeTypes.has(file.type)) {
    return NextResponse.json(
      {
        error: "Unsupported file type.",
        message: "Upload a jpg, png, webp, gif, mp4, or webm file.",
      },
      {
        status: 400,
      },
    );
  }

  const isVideoUpload = file.type.startsWith("video/");
  const maxSizeInBytes = isVideoUpload ? 50 * 1024 * 1024 : 8 * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    return NextResponse.json(
      {
        error: "File is too large.",
        message: isVideoUpload
          ? "Video upload is too large. Max 50 MB."
          : "Image upload is too large. Max 8 MB.",
      },
      {
        status: 400,
      },
    );
  }

  const uploadDir = getUploadDir();

  await mkdir(uploadDir, {
    recursive: true,
  });

  const extension = getFileExtension(file.type);
  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, fileBuffer);

  return NextResponse.json({
    url: `${getPublicUploadBaseUrl()}/${fileName}`,
    fileName,
  });
}