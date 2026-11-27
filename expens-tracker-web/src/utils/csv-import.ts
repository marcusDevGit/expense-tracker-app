import type { ImportExpenseItem } from "@/services/data.service";

export interface ColumnMapping {
  description: string;
  amount: string;
  expenseDate: string;
  categoryName: string;
  paymentMethod: string;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsvContent(content: string): {
  headers: string[];
  rows: string[][];
} {
  const lines = content
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  const headerLine = lines[0];
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semiCount = (headerLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ";" : ",";

  return {
    headers: parseCsvLine(headerLine, delimiter),
    rows: lines.slice(1).map((line) => parseCsvLine(line, delimiter)),
  };
}

export function detectInitialMapping(headers: string[]): ColumnMapping {
  const findHeader = (candidates: string[]) =>
    headers.find((h) => candidates.some((c) => h.toLowerCase().includes(c))) ??
    "";

  return {
    description: findHeader([
      "descri",
      "description",
      "historico",
      "histórico",
      "title",
      "nome",
    ]),
    amount: findHeader(["valor", "amount", "price", "total", "quantia"]),
    expenseDate: findHeader(["data", "date", "vencimento", "dia"]),
    categoryName: findHeader(["categ", "category", "tipo"]),
    paymentMethod: findHeader([
      "pagament",
      "payment",
      "forma",
      "metodo",
      "método",
    ]),
  };
}

function parseAmount(raw: string): number | null {
  if (!raw) return null;
  let cleaned = raw.replace(/[^\d.,-]/g, "");
  if (!cleaned) return null;

  if (cleaned.includes(",") && cleaned.includes(".")) {
    if (cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }

  const num = Math.abs(Number(cleaned));
  return Number.isFinite(num) && num > 0 ? num : null;
}

function parseDate(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  const brMatch = trimmed.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month}-${day}`;
  }
  const parsed = Date.parse(trimmed);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString().split("T")[0];
}

function normalizePaymentMethod(
  raw?: string,
): ImportExpenseItem["paymentMethod"] {
  if (!raw) return "OTHER";
  const val = raw.toLowerCase();
  if (val.includes("pix")) return "PIX";
  if (val.includes("créd") || val.includes("cred") || val.includes("credit")) {
    return "CREDIT_CARD";
  }
  if (val.includes("déb") || val.includes("deb") || val.includes("debit")) {
    return "DEBIT_CARD";
  }
  if (val.includes("dinheiro") || val.includes("cash")) return "CASH";
  if (val.includes("transf") || val.includes("ted") || val.includes("doc")) {
    return "BANK_TRANSFER";
  }
  return "OTHER";
}

export function buildMappedItems(
  headers: string[],
  rows: string[][],
  mapping: ColumnMapping,
): ImportExpenseItem[] {
  const descIdx = headers.indexOf(mapping.description);
  const amountIdx = headers.indexOf(mapping.amount);
  const dateIdx = headers.indexOf(mapping.expenseDate);
  const catIdx = mapping.categoryName
    ? headers.indexOf(mapping.categoryName)
    : -1;
  const payIdx = mapping.paymentMethod
    ? headers.indexOf(mapping.paymentMethod)
    : -1;

  if (descIdx === -1 || amountIdx === -1 || dateIdx === -1) return [];

  const items: ImportExpenseItem[] = [];
  for (const row of rows) {
    const description = row[descIdx]?.trim();
    const amount = parseAmount(row[amountIdx] ?? "");
    const expenseDate = parseDate(row[dateIdx] ?? "");
    if (!description || !amount || !expenseDate) continue;

    items.push({
      description,
      amount,
      expenseDate,
      categoryName: catIdx >= 0 ? row[catIdx]?.trim() || undefined : undefined,
      paymentMethod:
        payIdx >= 0 ? normalizePaymentMethod(row[payIdx]) : "OTHER",
    });
  }
  return items;
}
