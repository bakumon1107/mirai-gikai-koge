/**
 * サイト設定ファイル
 *
 * 地域固有の情報はこのファイルに集約されています。
 * Fork して別の地方議会向けに使用する場合は、まずこのファイルを変更してください。
 *
 * ★ が付いた項目は fork 時に必ず変更が必要です（AGPL-3.0 第7条に基づく追加条件）。
 *
 * @see FORK_GUIDELINES.md 本家リポジトリの fork ガイドライン
 * @see docs/20260304_1000_別地域向けfork手順.md 具体的な手順
 */
export const siteConfig = {
  /**
   * ★ サイト名
   * 「みらい議会」の名称を使う場合は「みらい議会＠地域名」形式にすること。
   * （例: "みらい議会＠渋谷区" / "みらい議会＠福岡市"）
   * 独自のサービス名を使う場合はこの形式に限りません。
   * @see FORK_GUIDELINES.md 1. サービス名称
   */
  siteName: "みらい議会＠上毛町",
  siteDescription:
    "福岡県上毛町議会の定例会・議案の議決結果や一般質問をわかりやすく伝えるアーカイブプラットフォームです",
  /** 自治体名（例: "サンプル市" / "サンプル県" / "サンプル町"） */
  cityName: "上毛町",
  /** 議会名（例: "サンプル市議会" / "サンプル県議会"） */
  councilName: "上毛町議会",
  /**
   * 住民の呼称（例: "市民" / "県民" / "区民" / "町民"）
   * UI テキストや AI プロンプトから参照します。
   */
  residentTerm: "町民",
  /**
   * トップページの構成パターン
   * - "bills": 議案中心（Tier 2：議案のAI解説が揃っている自治体向け・既定）
   * - "archive": 議事録・活動中心（Tier 1 や議案本文が薄い自治体向け）
   */
  homeLayout: "archive" as "bills" | "archive",
  /** 首長の役職名（知事・市長・区長・町長・村長） */
  executiveTitle: "町長",
  /** 首長の氏名（任意。空文字列なら executiveTitle のみを表示） */
  executiveName: "",
  /** 行政の呼称（県政・市政・区政・町政・村政）。テーマ・分類ラベルに使用 */
  governmentTerm: "町政",
  /** 定例会の通常開催月（市区町村は [3, 6, 9, 12]、都道府県は [2, 6, 9, 12] 等） */
  regularSessionMonths: [3, 6, 9, 12] as readonly number[],
  keywords: [
    "みらい議会＠上毛町",
    "上毛町",
    "上毛町議会",
    "福岡県",
    "一般質問",
    "議案",
    "議決結果",
    "地方政治",
  ],
  councilBaseUrl: "https://www.town.koge.lg.jp/chosei/gikai/index.html",
  /** 議案・議決結果の一覧ページ */
  councilBillsDetailUrl: "https://www.town.koge.lg.jp/chosei/gikai/3558.html",
  twitterHashtag: "みらい議会上毛町", // # なし
  /**
   * ★ このサイト自身のソースコード公開先リポジトリ URL
   *
   * AGPL-3.0 第13条により、ネットワーク経由でサービスを提供する場合は
   * 利用者が「実際に稼働しているバージョン」のソースコードを入手できる手段を
   * 提供する必要があります。本家（team-mirai/mirai-gikai）の URL では代用できません。
   * 誰でもアクセスできる公開リポジトリを指定してください。
   *
   * フッターにリンクとして表示されます。
   * **未設定（空文字列）またはプレースホルダのままの場合はリンクが表示されません。**
   * 表示されない状態で公開すると AGPL 違反になるため、公開前に必ず設定してください。
   * （誤って `https://github.com/YOUR_ACCOUNT/...` のような例示値を残したまま公開し、
   *   リンクはあるが 404 する――という状態を防ぐため、プレースホルダも弾いています）
   * @see FORK_GUIDELINES.md 6. ソースコード公開先へのリンクの表示
   * @see web/src/config/is-placeholder-url.ts 判定ロジック
   */
  sourceCodeUrl: "https://github.com/bakumon1107/mirai-gikai-koge" as string,
  externalLinks: {
    /** ★ 誤り報告フォーム（本家のフォームを流用せず、自前のものを用意すること） */
    report: "",
    /** サービス説明記事（note 等）。空文字列なら関連リンクを表示しない */
    aboutNote: "",
    /**
     * 以下 4 つは `features.showTeamMiraiSection` が true のときだけ使用されます。
     * 非公式運営（false）の場合は参照されません。
     */
    donation: "https://team-mir.ai/support/donation",
    teamAbout: "https://team-mir.ai/about",
    terms: "https://team-mir.ai/terms",
    privacy: "https://team-mir.ai/privacy",
    /**
     * よくある質問の外部ページ（本家の Notion を流用しないこと）。
     *
     * NOTE: 現在この値はどこからも参照されていない。FAQ はアプリ内の `/faq`
     * （web/src/app/faq/page.tsx）で完結しているため、外部ページへ差し替えたい場合は
     * 参照側の実装を追加する必要がある。設定するだけでは切り替わらない。
     */
    faq: "",
  },
  /**
   * ページを管理する政党名（空文字列の場合は政党名を省略した汎用表現を使用）
   * 政党が運営主体でない場合は空文字列のままにしてください。
   * 例: "チームみらい"
   */
  managingParty: "" as string,
  /**
   * ★ サービス運営者情報
   * 利用規約・プライバシーポリシー・問い合わせ先・運営者の立場開示に使用します。
   */
  operator: {
    /** 運営者名（個人名・団体名） */
    name: "運営者名" as string,
    /** 問い合わせ先 URL（SNS アカウント・フォーム等） */
    contactUrl: "https://example.com/contact" as string,
    /** 利用規約の準拠法・管轄裁判所（第一審の専属的合意管轄） */
    jurisdiction: "福岡地方裁判所" as string,
    /**
     * 運営者の立場・利益相反の開示文。
     * 空文字列なら表示しません。
     *
     * 議員・会派・後援会・候補者など政治的な立場を持つ場合は、
     * 利用者が判断できるようここで明示してください。
     * 例: "運営者はサンプル市議会議員（◯◯会派）です。"
     *     "運営者は特定の政党・会派・候補者と関係のない個人です。"
     */
    disclosure: "" as string,
  },
  /**
   * 機能の有効/無効設定（調査結果に合わせてパーツ単位でオン/オフを切り替えられます）
   */
  features: {
    /** 議案一覧・議案詳細 */
    bills: true as boolean,
    /** 会派別賛否の表示（上毛町議会は全員無所属のため false） */
    showFactionStances: false as boolean,
    /** 一般質問・代表質問アーカイブ */
    generalQuestions: true as boolean,
    /** 委員会議事録アーカイブ（独立した委員会議事録がないため false） */
    committeeMinutes: false as boolean,
    /** 首長記者会見アーカイブ（町長定例記者会見の公開がないため false） */
    pressConferences: false as boolean,
    /** 横断検索・テーマから探す */
    search: true as boolean,
    /** AIチャット機能（議案への質問・テキスト選択からの質問）*/
    aiChat: false as boolean,
    /**
     * AIインタビュー機能（議案当事者へのヒアリング）
     *
     * 住民の意見と連絡先を収集する機能です。個人情報の取り扱い方針と
     * 運営体制を定めてから有効化してください（既定は無効）。
     */
    aiInterview: false as boolean,
    /**
     * チームみらいセクションの表示（トップページ・フッター・デスクトップメニュー）
     *
     * 党の公式サービスとして運営する場合のみ true にしてください。
     * false のとき、党のロゴ・寄附リンク・党紹介セクションは表示されず、
     * 代わりに「政党チームみらいが運営しているものではありません」の
     * 免責文言がフッターに表示されます。
     * @see FORK_GUIDELINES.md 5. 免責文言の表示
     */
    showTeamMiraiSection: false as boolean,
  },
} as const;
