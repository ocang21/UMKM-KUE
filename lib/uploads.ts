import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const uploadDir = path.join(process.cwd(), "public", "uploads");

function getExtension(fileName: string, mimeType: string): string {
  const extFromName = path.extname(fileName || "");
  if (extFromName) return extFromName.toLowerCase();

  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    default:
      return ".bin";
  }
}

function normalizeUrl(url: string): string {
  return url.replace(/^\/+/, "");
}

export async function saveUpload(file: File): Promise<string> {
  try {
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getExtension(file.name, file.type);
    const randomName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
    const targetPath = path.join(uploadDir, randomName);

    await fs.writeFile(targetPath, buffer);

    return `/uploads/${randomName}`;
  } catch (fsError) {
    console.warn("Saving to filesystem fallback to base64:", fsError);
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }
}

const dataUrlRegex = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/;

export async function saveDataUrl(dataUrl: string): Promise<string> {
  const match = dataUrl.match(dataUrlRegex);
  if (!match) {
    throw new Error("Invalid data URL format");
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");
  const extension = getExtension("", mimeType);
  const randomName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`;
  const targetPath = path.join(uploadDir, randomName);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return `/uploads/${randomName}`;
}

export async function deleteUpload(url: string): Promise<void> {
  if (!url || !url.startsWith("/uploads/")) {
    return;
  }

  const targetPath = path.join(process.cwd(), "public", normalizeUrl(url));
  await fs.rm(targetPath).catch(() => undefined);
}
