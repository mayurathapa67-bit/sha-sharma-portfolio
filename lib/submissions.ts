import { promises as fs, existsSync } from "fs";
import path from "path";
import type { Submission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "submissions.json");

async function ensure(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    if (!existsSync(FILE)) {
      await fs.writeFile(FILE, "[]", "utf-8");
    }
  } catch {
    /* ignore */
  }
}

export async function readSubmissions(): Promise<Submission[]> {
  try {
    await ensure();
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Submission[]) : [];
  } catch {
    return [];
  }
}

export async function addSubmission(s: Submission): Promise<void> {
  try {
    const all = await readSubmissions();
    all.unshift(s);
    await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    /* ignore */
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const all = await readSubmissions();
    const next = all.filter((s) => s.id !== id);
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
