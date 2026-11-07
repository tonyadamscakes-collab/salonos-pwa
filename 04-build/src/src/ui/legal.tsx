import { marked } from "marked";
import legalRaw from "../content/legal-all.md?raw";

export interface LegalDoc {
  id: string;
  title: string;
  markdown: string;
}

const DRAFT = "DRAFT – NOT LEGAL ADVICE – review by a UK solicitor before use";

export function legalDocs(): LegalDoc[] {
  const chunks = legalRaw.split(/\n(?=# LEG-\d+)/).filter((chunk) => chunk.startsWith("# LEG-"));
  return chunks.map((chunk) => {
    const titleLine = chunk.split("\n")[0] ?? "";
    const id = titleLine.match(/LEG-\d+/)?.[0] ?? "LEG";
    return { id, title: titleLine.replace(/^#\s*/, ""), markdown: chunk };
  });
}

export function legalHtml(markdown: string): string {
  const safe = markdown.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const parsed = marked.parse(safe, { async: false, gfm: true });
  return typeof parsed === "string" ? parsed : "";
}

export function DraftBanner() {
  return (
    <p className="banner" role="note">
      <strong>{DRAFT}</strong>
    </p>
  );
}

export { DRAFT };
