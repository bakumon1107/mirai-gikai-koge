import "server-only";
import { getJapanTime } from "@/lib/utils/date";
import { findLatestSessionWithBills } from "../repositories/bill-repository";

function todayInJst(): string {
  const now = getJapanTime();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export async function getLatestSessionWithBills(): Promise<string | null> {
  const session = await findLatestSessionWithBills(todayInJst());
  return session?.slug ?? null;
}
