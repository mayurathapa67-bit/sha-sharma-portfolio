import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await (file as Blob).arrayBuffer();
  const buffer = Buffer.from(bytes).toString("base64");
  const folder = (form.get("folder") as string) || "esha-portfolio";

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          `data:${(file as File).type};base64,${buffer}`,
          { folder, resource_type: "auto" },
          (err, res) => {
            if (err || !res) reject(err);
            else resolve(res as { secure_url: string; public_id: string });
          }
        );
      }
    );
    return NextResponse.json(
      { url: result.secure_url, public_id: result.public_id },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
