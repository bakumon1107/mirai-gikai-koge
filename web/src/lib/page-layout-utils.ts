import { siteConfig } from "@/config/site.config";

/**
 * ページレイアウトに関するユーティリティ
 *
 * TOPページと議案詳細ページは「メインページ」として扱い、
 * - DifficultySelectorを表示（archive レイアウトでは議案詳細のみ）
 * - チャットサイドバー用のオフセットレイアウトを使用
 */

/** 議案詳細ページ（/bills/[id]）- サブパスは除外 */
export function isBillDetailPage(pathname: string): boolean {
  return /\/bills\/[^/]+$/.test(pathname);
}

/** メインページ（TOP、議案詳細）かどうかを判定 */
export function isMainPage(pathname: string): boolean {
  // トップページ
  if (pathname === "/") return true;
  // 議案詳細ページ（/bills/[id]）- サブパスは除外
  if (isBillDetailPage(pathname)) return true;
  return false;
}

/**
 * 幅広レイアウトのページかどうかを判定。
 * MainLayout の max-w-[700px] を外し、ヘッダと同じ max-w-[1440px] まで使う。
 */
export function isWidePage(
  pathname: string,
  homeLayout: "bills" | "archive" = siteConfig.homeLayout
): boolean {
  // archive レイアウト時のトップページは PC 全幅レイアウト
  if (pathname === "/" && homeLayout === "archive") return true;
  return false;
}

/**
 * ヘッダーの難易度切替（DifficultySelector）を表示するかどうかを判定。
 * archive トップには難易度切替対象の議案本文がないため、議案詳細のみ表示する。
 */
export function shouldShowDifficultySelector(
  pathname: string,
  homeLayout: "bills" | "archive" = siteConfig.homeLayout,
  billsEnabled: boolean = siteConfig.features.bills
): boolean {
  if (!billsEnabled) return false;
  if (homeLayout === "archive") return isBillDetailPage(pathname);
  return isMainPage(pathname);
}

/** インタビューチャットページかどうかを判定 */
export function isInterviewPage(pathname: string): boolean {
  // /bills/[id]/interview/chat
  return /\/bills\/[^/]+\/interview\/chat$/.test(pathname);
}

/** インタビューセクション（LP・チャット含む）かどうかを判定 */
export function isInterviewSection(pathname: string): boolean {
  // /bills/[id]/interview 以下すべて
  return /\/bills\/[^/]+\/interview(\/|$)/.test(pathname);
}

/** インタビューページからbillIdを抽出 */
export function extractBillIdFromPath(pathname: string): string | null {
  const match = pathname.match(/\/bills\/([^/]+)/);
  return match ? match[1] : null;
}
