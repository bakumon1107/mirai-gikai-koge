import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { SessionList } from "@/features/council-sessions/server/components/session-list";
import { getAllPastSessions } from "@/features/council-sessions/server/loaders/get-all-past-sessions";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `過去の議会一覧 | ${siteConfig.siteName}`,
  description: `${siteConfig.councilName}で過去に開催された定例会の一覧です。`,
};

export default async function SessionsPage() {
  if (!siteConfig.features.bills && !siteConfig.features.generalQuestions) {
    notFound();
  }

  const sessions = await getAllPastSessions();
  const isArchiveLayout = siteConfig.homeLayout === "archive";

  return (
    <Container className="py-8">
      {isArchiveLayout && (
        <div className="mb-4">
          <Link
            href={routes.home()}
            className="inline-flex items-center gap-1 text-sm text-mirai-text-secondary hover:text-mirai-text"
          >
            <ChevronLeft className="w-4 h-4" />
            トップに戻る
          </Link>
        </div>
      )}
      <div className="mb-6">
        <h1 className="font-rounded text-2xl font-bold text-mirai-text pc:text-3xl">
          過去の議会一覧
        </h1>
        <p className="mt-2 text-sm text-mirai-text-secondary">
          {siteConfig.councilName}
          で過去に開催された定例会をご覧いただけます。
        </p>
      </div>

      {isArchiveLayout ? (
        <div className="rounded-[28px] bg-white p-5 pc:p-8">
          <SessionList sessions={sessions} />
        </div>
      ) : (
        <SessionList sessions={sessions} />
      )}
    </Container>
  );
}
