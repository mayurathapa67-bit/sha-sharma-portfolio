import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readSubmissions, deleteSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = await readSubmissions();
  return NextResponse.json(
    { submissions },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const ok = await deleteSubmission(id);
  return NextResponse.json(
    { ok },
    { headers: { "Cache-Control": "no-store" } }
  );
}
