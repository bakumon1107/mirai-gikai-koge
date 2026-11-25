import { describe, expect, it } from "vitest";
import {
  buildMobileNavItems,
  buildPcNavItems,
  isNavItemActive,
} from "./nav-items";

describe("buildPcNavItems", () => {
  it("全パーツ有効時は首長役職付きの5項目を返す", () => {
    const items = buildPcNavItems(
      {
        bills: true,
        generalQuestions: true,
        committeeMinutes: true,
        pressConferences: true,
        search: true,
      },
      "町長"
    );
    expect(items.map((i) => i.label)).toEqual([
      "ホーム",
      "質問",
      "委員会",
      "議案",
      "町長会見",
    ]);
  });

  it("無効なパーツを除外する", () => {
    const items = buildPcNavItems(
      {
        bills: false,
        generalQuestions: true,
        committeeMinutes: false,
        pressConferences: false,
        search: true,
      },
      "町長"
    );
    expect(items.map((i) => i.label)).toEqual(["ホーム", "質問", "定例会"]);
  });
});

describe("buildMobileNavItems", () => {
  it("有効パーツに応じて最大5枠を返す", () => {
    const all = buildMobileNavItems({
      bills: true,
      generalQuestions: true,
      committeeMinutes: true,
      pressConferences: true,
      search: true,
    });
    expect(all.map((i) => i.label)).toEqual([
      "ホーム",
      "会見",
      "委員会",
      "定例会",
      "さがす",
    ]);

    const minimal = buildMobileNavItems({
      bills: true,
      generalQuestions: true,
      committeeMinutes: false,
      pressConferences: false,
      search: true,
    });
    expect(minimal.map((i) => i.label)).toEqual(["ホーム", "定例会", "さがす"]);
  });
});

describe("isNavItemActive", () => {
  it("/sessions/[slug]/questions は質問タブが現在地になり議案タブは非アクティブになる", () => {
    const items = buildPcNavItems(
      {
        bills: true,
        generalQuestions: true,
        committeeMinutes: true,
        pressConferences: true,
        search: true,
      },
      "市長"
    );
    const questions = items.find((i) => i.label === "質問");
    const bills = items.find((i) => i.label === "議案");
    expect(bills?.href).toBe("/bills");
    expect(
      questions && isNavItemActive(questions, "/sessions/r8-09/questions")
    ).toBe(true);
    expect(bills && isNavItemActive(bills, "/sessions/r8-09/questions")).toBe(
      false
    );
    expect(bills && isNavItemActive(bills, "/sessions")).toBe(false);
    expect(bills && isNavItemActive(bills, "/bills")).toBe(true);
    expect(bills && isNavItemActive(bills, "/sessions/r8-09/bills")).toBe(true);
    expect(bills && isNavItemActive(bills, "/bills/bill-1")).toBe(true);
    expect(bills && isNavItemActive(bills, "/bills/bill-1/opinions")).toBe(
      true
    );
  });
});
