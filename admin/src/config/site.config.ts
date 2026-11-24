/**
 * サイト設定ファイル（Admin）
 *
 * Fork して別の地方議会向けに使用する場合はこのファイルを変更してください。
 * web 側の `web/src/config/site.config.ts` と値を揃える必要があります。
 *
 * @see FORK_GUIDELINES.md
 * @see docs/20260304_1000_別地域向けfork手順.md
 */
export const siteConfig = {
  /** 「みらい議会」の名称を使う場合は「みらい議会＠地域名」形式にすること */
  siteName: "みらい議会＠上毛町",
  /** 自治体名（例: "サンプル市" / "サンプル県" / "サンプル町"） */
  cityName: "上毛町",
  /** 議会名（例: "サンプル市議会" / "サンプル県議会"） */
  councilName: "上毛町議会",
  /** 住民の呼称（例: "市民" / "県民" / "区民" / "町民"）。AIプロンプトから参照する */
  residentTerm: "町民",
  councilBaseUrl: "https://www.town.koge.lg.jp/chosei/gikai/index.html",
  councilBillsDetailUrl: "https://www.town.koge.lg.jp/chosei/gikai/3558.html",
  /**
   * 会派名の例。AI情報収集のプロンプトで、会派名の表記ゆれを吸収するために使う。
   * 上毛町議会は全員無所属（会派制なし）。
   */
  councilFactionExamples: "無所属（上毛町議会は会派制なし）",
} as const;
