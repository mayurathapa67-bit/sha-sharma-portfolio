import { NextRequest, NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Partial<Submission>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  const message = (body.message ?? "").toString().trim();
  const project_type = (body.project_type ?? "General").toString().trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required" },
      { status: 400 }
    );
  }

  const submission: Submission = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sub_${Date.now()}`,
    name,
    email,
    message,
    project_type: project_type || "General",
    created_at: new Date().toISOString(),
  };

  await addSubmission(submission);

  return NextResponse.json(
    { ok: true, id: submission.id },
    { headers: { "Cache-Control": "no-store" } }
  );
}
