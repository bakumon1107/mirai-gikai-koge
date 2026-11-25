import { siteConfig } from "@/config/site.config";
import { routes } from "@/lib/routes";

export type NavFeatures = {
  bills: boolean;
  generalQuestions: boolean;
  committeeMinutes: boolean;
  pressConferences: boolean;
  search: boolean;
};

export type NavItem = {
  href: string;
  label: string;
  alsoActiveOn?: RegExp;
  excludes?: RegExp;
};

export type MobileNavIcon =
  | "home"
  | "megaphone"
  | "users"
  | "landmark"
  | "search";

export type MobileNavItem = NavItem & { icon: MobileNavIcon };

/** 一般質問の実体ページ（/questions はここへリダイレクトされる） */
const SESSION_QUESTIONS_RE = /^\/sessions\/[^/]+\/questions(\/|$)/;

/** 議案一覧の実体ページ（/bills はここへリダイレクトされる） */
const SESSION_BILLS_RE = /^\/sessions\/[^/]+\/bills(\/|$)/;

/**
 * PC 横並びグローバルナビの項目を有効パーツから組み立てる。
 */
export function buildPcNavItems(
  features: NavFeatures = siteConfig.features,
  executiveTitle: string = siteConfig.executiveTitle
): NavItem[] {
  const items: NavItem[] = [{ href: routes.home(), label: "ホーム" }];

  if (features.generalQuestions) {
    items.push({
      href: routes.questions(),
      label: "質問",
      alsoActiveOn: SESSION_QUESTIONS_RE,
    });
  }

  if (features.committeeMinutes) {
    items.push({ href: routes.committees(), label: "委員会" });
  }

  if (features.bills) {
    items.push({
      href: routes.bills(),
      label: "議案",
      alsoActiveOn: SESSION_BILLS_RE,
    });
  } else if (features.generalQuestions) {
    items.push({
      href: routes.sessions(),
      label: "定例会",
      excludes: SESSION_QUESTIONS_RE,
    });
  }

  if (features.pressConferences) {
    items.push({
      href: routes.pressConferences(),
      label: `${executiveTitle}会見`,
    });
  }

  return items;
}

/**
 * スマホのボトムナビの項目を有効パーツから組み立てる（最大5枠）。
 */
export function buildMobileNavItems(
  features: NavFeatures = siteConfig.features
): MobileNavItem[] {
  const items: MobileNavItem[] = [
    { href: routes.home(), label: "ホーム", icon: "home" },
  ];

  if (features.pressConferences) {
    items.push({
      href: routes.pressConferences(),
      label: "会見",
      icon: "megaphone",
    });
  }

  if (features.committeeMinutes) {
    items.push({
      href: routes.committees(),
      label: "委員会",
      icon: "users",
    });
  }

  if (features.bills || features.generalQuestions) {
    items.push({
      href: routes.sessions(),
      label: "定例会",
      icon: "landmark",
    });
  }

  if (features.search) {
    items.push({
      href: routes.search(),
      label: "さがす",
      icon: "search",
    });
  }

  return items;
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.alsoActiveOn?.test(pathname)) return true;
  if (item.excludes?.test(pathname)) return false;

  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
