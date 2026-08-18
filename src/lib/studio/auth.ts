import { NextResponse } from "next/server";

export function isStudioAuthorized(request: Request) {
  const expectedToken = process.env.STUDIO_ACCESS_TOKEN;

  if (!expectedToken) {
    return false;
  }

  const authorizationHeader = request.headers.get("authorization") ?? "";
  const token = authorizationHeader.replace(/^Bearer\s+/i, "").trim();

  return token === expectedToken;
}

export function studioUnauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "Studio access token is missing or invalid.",
    },
    {
      status: 401,
    },
  );
}