import { describe, expect, it } from "vitest";

import {
  extractBillIdFromPath,
  isBillDetailPage,
  isInterviewPage,
  isInterviewSection,
  isMainPage,
  isWidePage,
  shouldShowDifficultySelector,
} from "./page-layout-utils";

describe("isBillDetailPage", () => {
  it("returns true for bill detail pages", () => {
    expect(isBillDetailPage("/bills/abc-123")).toBe(true);
    expect(isBillDetailPage("/preview/bills/abc-123")).toBe(true);
  });

  it("returns false for top and sub-pages", () => {
    expect(isBillDetailPage("/")).toBe(false);
    expect(isBillDetailPage("/bills")).toBe(false);
    expect(isBillDetailPage("/bills/abc-123/interview")).toBe(false);
  });
});

describe("isWidePage", () => {
  it("returns true for top and sub-pages in archive layout", () => {
    expect(isWidePage("/", "archive")).toBe(true);
    expect(isWidePage("/questions", "archive")).toBe(true);
    expect(isWidePage("/sessions/r8-03/bills", "archive")).toBe(true);
    expect(isWidePage("/bills/abc-123", "archive")).toBe(true);
    expect(isWidePage("/search", "archive")).toBe(true);
  });

  it("returns false for interview pages even in archive layout", () => {
    expect(isWidePage("/bills/abc-123/interview", "archive")).toBe(false);
    expect(isWidePage("/bills/abc-123/interview/chat", "archive")).toBe(false);
  });

  it("returns false for all pages in bills layout", () => {
    expect(isWidePage("/", "bills")).toBe(false);
    expect(isWidePage("/questions", "bills")).toBe(false);
    expect(isWidePage("/bills/abc-123", "bills")).toBe(false);
  });
});

describe("shouldShowDifficultySelector", () => {
  it("returns false when bills feature is disabled", () => {
    expect(shouldShowDifficultySelector("/", "bills", false)).toBe(false);
    expect(
      shouldShowDifficultySelector("/bills/abc-123", "archive", false)
    ).toBe(false);
  });

  it("hides on top page in archive layout but shows on bill detail", () => {
    expect(shouldShowDifficultySelector("/", "archive", true)).toBe(false);
    expect(
      shouldShowDifficultySelector("/bills/abc-123", "archive", true)
    ).toBe(true);
    expect(shouldShowDifficultySelector("/questions", "archive", true)).toBe(
      false
    );
  });

  it("shows on both top page and bill detail in bills layout", () => {
    expect(shouldShowDifficultySelector("/", "bills", true)).toBe(true);
    expect(shouldShowDifficultySelector("/bills/abc-123", "bills", true)).toBe(
      true
    );
    expect(shouldShowDifficultySelector("/search", "bills", true)).toBe(false);
  });
});

describe("isMainPage", () => {
  it("returns true for the top page", () => {
    expect(isMainPage("/")).toBe(true);
  });

  it("returns true for a bill detail page", () => {
    expect(isMainPage("/bills/abc-123")).toBe(true);
  });

  it("returns false for a bill sub-page", () => {
    expect(isMainPage("/bills/abc-123/interview")).toBe(false);
  });

  it("returns false for an unrelated path", () => {
    expect(isMainPage("/about")).toBe(false);
  });

  it("returns false for the bills list page", () => {
    expect(isMainPage("/bills")).toBe(false);
    expect(isMainPage("/bills/")).toBe(false);
  });
});

describe("isInterviewPage", () => {
  it("returns true for an interview chat page", () => {
    expect(isInterviewPage("/bills/abc-123/interview/chat")).toBe(true);
  });

  it("returns false for an interview page without /chat", () => {
    expect(isInterviewPage("/bills/abc-123/interview")).toBe(false);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewPage("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewPage("/")).toBe(false);
  });
});

describe("isInterviewSection", () => {
  it("returns true for the interview LP page", () => {
    expect(isInterviewSection("/bills/abc-123/interview")).toBe(true);
  });

  it("returns true for the interview chat page", () => {
    expect(isInterviewSection("/bills/abc-123/interview/chat")).toBe(true);
  });

  it("returns false for a bill detail page", () => {
    expect(isInterviewSection("/bills/abc-123")).toBe(false);
  });

  it("returns false for the top page", () => {
    expect(isInterviewSection("/")).toBe(false);
  });

  it("returns false for unrelated paths", () => {
    expect(isInterviewSection("/about")).toBe(false);
  });
});

describe("extractBillIdFromPath", () => {
  it("extracts bill ID from a bill detail path", () => {
    expect(extractBillIdFromPath("/bills/abc-123")).toBe("abc-123");
  });

  it("extracts bill ID from a bill sub-path", () => {
    expect(extractBillIdFromPath("/bills/abc-123/interview/chat")).toBe(
      "abc-123"
    );
  });

  it("returns null when path does not contain /bills/", () => {
    expect(extractBillIdFromPath("/about")).toBeNull();
  });

  it("returns null for the top page", () => {
    expect(extractBillIdFromPath("/")).toBeNull();
  });
});
