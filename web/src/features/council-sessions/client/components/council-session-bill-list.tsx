import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site.config";
import type {
  BillWithContent,
  ComingSoonBill,
} from "@/features/bills/shared/types";
import { routes } from "@/lib/routes";
import type { CouncilSession } from "../../shared/types";
import { formatSessionPeriod } from "../../shared/utils/group-sessions-by-year";
import { BillListWithStatusFilter } from "./bill-list-with-status-filter";

type Props = {
  session: CouncilSession;
  bills: BillWithContent[];
  comingSoonBills?: ComingSoonBill[];
};

export function CouncilSessionBillList({
  session,
  bills,
  comingSoonBills = [],
}: Props) {
  const isArchiveLayout = siteConfig.homeLayout === "archive";
  const startYear = Number(session.start_date.slice(0, 4));
  const sessionTitle = session.name.includes("年")
    ? session.name
    : `${startYear}年 ${session.name}`;
  const periodLabel = formatSessionPeriod(session);
  const sessionDescription = `${periodLabel}に実施された${session.name}`;

  return (
    <div className="flex flex-col gap-6 pc:gap-8">
      {isArchiveLayout ? (
        <div>
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
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-rounded text-2xl font-bold text-mirai-text pc:text-3xl">
              {sessionTitle}の議案
            </h1>
            <span className="rounded-full bg-archive-pill-bg px-3 py-0.5 text-sm font-bold text-archive-pill-text">
              {bills.length}件
            </span>
          </div>
          <p className="mt-2 text-sm text-mirai-text-secondary">
            {sessionDescription}に上程された議案の一覧です。
          </p>
        </div>
      ) : (
        <>
          {/* Archiveヘッダー */}
          <div className="flex flex-col gap-1">
            <h1>
              <Image
                src="/icons/archive-typography.svg"
                alt="Archive"
                width={156}
                height={36}
                priority
              />
            </h1>
            <p className="text-sm font-bold text-primary-accent">
              {session.name}に上程された議案
            </p>
          </div>

          {/* セクションヘッダー */}
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[22px] font-bold text-black leading-[1.48] flex items-center gap-4">
              {sessionTitle}の提出議案
              <span>{bills.length}件</span>
            </h2>
            <p className="text-xs font-medium text-mirai-text">
              {sessionDescription}
            </p>
          </div>
        </>
      )}

      {/* フィルター付き議案リスト（coming soon含む） */}
      {bills.length === 0 && comingSoonBills.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          この定例会の議案はまだありません
        </p>
      ) : (
        <BillListWithStatusFilter
          bills={bills}
          comingSoonBills={comingSoonBills}
        />
      )}

      {/* 議会リンク */}
      {session.council_url && (
        <div className="flex flex-wrap items-center gap-1 text-[13px] font-medium text-mirai-text">
          {sessionTitle}に上程された全ての議案は
          <a
            href={session.council_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary-accent"
          >
            {siteConfig.councilName}情報へ
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
