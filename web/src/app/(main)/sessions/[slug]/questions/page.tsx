import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";
import { SessionTopicsView } from "@/features/general-questions/server/components/session-topics-view";
import { getGeneralQuestionsBySession } from "@/features/general-questions/server/loaders/get-general-questions-by-session";
import { routes } from "@/lib/routes";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!siteConfig.features.generalQuestions) {
    return { title: "ページが見つかりません" };
  }

  const { slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    return { title: "定例会が見つかりません" };
  }

  return {
    title: `${session.name}の代表質問・一般質問 | ${siteConfig.siteName}`,
    description: `${session.name}で行われた代表質問・一般質問の一覧です。議員が${siteConfig.executiveTitle}・担当部署に直接質問した内容をわかりやすく解説します。`,
  };
}

export default async function SessionQuestionsPage({ params }: Props) {
  if (!siteConfig.features.generalQuestions) {
    notFound();
  }

  const { slug } = await params;
  const session = await getCouncilSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const questions = await getGeneralQuestionsBySession(session.id);

  return (
    <Container className="py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href={routes.home()}
          className="inline-flex items-center gap-1 text-sm text-mirai-text-secondary hover:text-mirai-text"
        >
          <ChevronLeft className="w-4 h-4" />
          トップに戻る
        </Link>
        <Link
          href={routes.sessions()}
          className="inline-flex items-center gap-1 text-sm text-mirai-text-secondary hover:text-mirai-text"
        >
          過去の定例会一覧
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="font-rounded text-2xl font-bold text-mirai-text pc:text-3xl">
          {session.name}の代表質問・一般質問
        </h1>
        <p className="mt-2 text-sm text-mirai-text-secondary">
          議員が問い、{siteConfig.cityName}
          が答えた。暮らしに関わる取り組みをテーマ別にまとめました。
        </p>
      </div>
      <SessionTopicsView questions={questions} />
    </Container>
  );
}
