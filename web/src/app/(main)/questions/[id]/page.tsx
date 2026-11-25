import { ChevronLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getCouncilSessionById } from "@/features/council-sessions/server/loaders/get-council-session-by-id";
import { QuestionChatView } from "@/features/general-questions/client/components/question-chat-view";
import { getGeneralQuestionById } from "@/features/general-questions/server/loaders/get-general-question-by-id";
import { questionTypeLabel } from "@/features/general-questions/shared/utils/question-type-label";
import { routes } from "@/lib/routes";
import { toSafeExternalUrl } from "@/lib/utils/safe-url";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!siteConfig.features.generalQuestions) {
    return { title: "ページが見つかりません" };
  }

  const { id } = await params;
  const question = await getGeneralQuestionById(id);

  if (!question) {
    return { title: "質問が見つかりません" };
  }

  return {
    title: `${question.questioner_name} 議員の${questionTypeLabel(
      question.question_type
    )} | ${siteConfig.siteName}`,
    description: question.summary ?? undefined,
  };
}

export default async function GeneralQuestionDetailPage({ params }: Props) {
  if (!siteConfig.features.generalQuestions) {
    notFound();
  }

  const { id } = await params;
  const question = await getGeneralQuestionById(id);

  if (!question) {
    notFound();
  }

  const session = await getCouncilSessionById(question.council_session_id);
  const backHref = session?.slug
    ? routes.sessionQuestions(session.slug)
    : routes.questions();
  const typeLabel = questionTypeLabel(question.question_type);
  const safeSourceUrl = toSafeExternalUrl(question.source_url);
  const sourceHref =
    safeSourceUrl ?? toSafeExternalUrl(siteConfig.councilBaseUrl);
  const sourceLabel = safeSourceUrl
    ? `${siteConfig.councilName} 公式会議録を見る`
    : `${siteConfig.councilName} 公式サイトを見る`;

  return (
    <Container className="py-8">
      <div className="mb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-mirai-text-secondary hover:text-mirai-text"
        >
          <ChevronLeft className="w-4 h-4" />
          質問の一覧に戻る
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="font-rounded text-2xl font-bold text-mirai-text pc:text-3xl">
          {question.questioner_name} 議員
        </h1>
        <p className="mt-1 text-sm text-mirai-text-secondary">
          {question.questioner_party && (
            <span>{question.questioner_party}　｜　</span>
          )}
          {typeLabel}　｜　第{question.session_day}日
        </p>
      </div>

      {question.summary && (
        <p className="mb-6 max-w-4xl text-mirai-text leading-relaxed">
          {question.summary}
        </p>
      )}

      {question.topics.length > 0 ? (
        <div className="rounded-[28px] bg-white p-5 pc:p-9">
          <div className="mx-auto max-w-3xl">
            <QuestionChatView topics={question.topics} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-mirai-border bg-white p-5 text-sm text-mirai-text-secondary leading-relaxed">
          論点の要約は現在準備中です。詳しい発言内容は下記の公式会議録をご確認ください。
        </div>
      )}

      {sourceHref && (
        <div className="mt-8 rounded-2xl border border-mirai-border bg-white p-5">
          <p className="text-xs text-mirai-text-secondary leading-relaxed">
            正確な発言記録・原文は公式会議録をご確認ください。
          </p>
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-accent hover:underline"
          >
            {sourceLabel}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </Container>
  );
}
