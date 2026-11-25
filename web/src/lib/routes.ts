/**
 * web アプリの内部ルート定義
 *
 * app/ ディレクトリの page.tsx と 1:1 対応する。
 * Link href や router.push には必ずこのファイルの関数を使うこと。
 * 新しいページを追加したらここにもルートを追加し、テストを通すこと。
 */

export const routes = {
  // ── 静的ルート ──────────────────────────────────────
  home: () => "/" as const,
  terms: () => "/terms" as const,
  privacy: () => "/privacy" as const,

  // ── 議案 ──────────────────────────────────────────
  bills: () => "/bills" as const,
  billDetail: (billId: string) => `/bills/${billId}` as const,
  billOpinions: (billId: string) => `/bills/${billId}/opinions` as const,

  // ── インタビュー ──────────────────────────────────
  interviewLP: (billId: string) => `/bills/${billId}/interview` as const,
  interviewDisclosure: (billId: string) =>
    `/bills/${billId}/interview/disclosure` as const,
  interviewChat: (billId: string) => `/bills/${billId}/interview/chat` as const,

  // ── プレビュー（token 付き） ──────────────────────
  previewBillDetail: (billId: string, token: string) =>
    `/preview/bills/${billId}?token=${encodeURIComponent(token)}` as const,
  previewInterviewLP: (billId: string, token: string) =>
    `/preview/bills/${billId}/interview?token=${encodeURIComponent(token)}` as const,
  previewInterviewDisclosure: (billId: string, token: string) =>
    `/preview/bills/${billId}/interview/disclosure?token=${encodeURIComponent(token)}` as const,
  previewInterviewChat: (billId: string, token: string) =>
    `/preview/bills/${billId}/interview/chat?token=${encodeURIComponent(token)}` as const,

  // ── レポート ──────────────────────────────────────
  publicReport: (reportId: string) => `/report/${reportId}` as const,
  reportComplete: (reportId: string) => `/report/${reportId}/complete` as const,
  reportChatLog: (reportId: string) => `/report/${reportId}/chat-log` as const,

  // ── 定例会セッション ────────────────────────────────
  sessions: () => "/sessions" as const,
  sessionBills: (slug: string) => `/sessions/${slug}/bills` as const,
  sessionQuestions: (slug: string) => `/sessions/${slug}/questions` as const,

  // ── 一般質問・代表質問 ──────────────────────────────
  questions: () => "/questions" as const,
  questionDetail: (id: string) => `/questions/${id}` as const,

  // ── 委員会議事録 ────────────────────────────────────
  committees: () => "/committees" as const,
  committeeDetail: (slug: string) => `/committees/${slug}` as const,
  committeeMeeting: (slug: string, meetingId: string) =>
    `/committees/${slug}/${meetingId}` as const,
  committeeMeetingTranscript: (slug: string, meetingId: string) =>
    `/committees/${slug}/${meetingId}/transcript` as const,

  // ── 首長記者会見 ────────────────────────────────────
  pressConferences: () => "/press-conferences" as const,
  pressConferenceDetail: (slug: string) =>
    `/press-conferences/${slug}` as const,

  // ── 検索 ────────────────────────────────────────────
  search: (query?: string) =>
    query
      ? (`/search?q=${encodeURIComponent(query)}` as const)
      : ("/search" as const),

  // ── その他 ────────────────────────────────────────
  faq: () => "/faq" as const,
} as const;
