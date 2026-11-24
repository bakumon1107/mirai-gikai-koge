"use client";

import { Search } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DesktopNav } from "@/components/layouts/navigation/desktop-nav";
import { siteConfig } from "@/config/site.config";
import { DifficultySelector } from "@/features/bill-difficulty/client/components/difficulty-selector";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import type { CouncilSession } from "@/features/council-sessions/shared/types";
import { InterviewHeaderActions } from "@/features/interview-session/client/components/interview-header-actions";
import {
  isInterviewPage,
  shouldShowDifficultySelector,
} from "@/lib/page-layout-utils";
import { routes } from "@/lib/routes";
import { HamburgerMenu } from "./hamburger-menu";

interface HeaderClientProps {
  difficultyLevel: DifficultyLevelEnum;
  sessions: CouncilSession[];
}

export function HeaderClient({ difficultyLevel, sessions }: HeaderClientProps) {
  const pathname = usePathname();
  const isArchiveLayout = siteConfig.homeLayout === "archive";
  const showDifficultySelector = shouldShowDifficultySelector(pathname);
  const showInterviewActions = isInterviewPage(pathname);

  return (
    <header className="px-3 fixed top-4 left-0 right-0 z-40 max-w-[1440px] mx-auto">
      <div className="rounded-2xl bg-white shadow-sm mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Site Title */}
          <div className="flex items-center">
            <Link
              href={routes.home()}
              className="flex items-center space-x-2"
              aria-label="ホーム"
            >
              {siteConfig.features.showTeamMiraiSection && (
                <Image
                  src="/img/logo.svg"
                  alt={siteConfig.siteName}
                  width={42}
                  height={36}
                />
              )}
              <div
                className={
                  isArchiveLayout
                    ? "text-sm sm:text-base font-bold whitespace-nowrap"
                    : "text-xl font-bold"
                }
              >
                {siteConfig.siteName}
              </div>
            </Link>
          </div>

          {isArchiveLayout && <DesktopNav />}

          {/* Navigation */}
          <nav
            className="flex items-center space-x-2"
            aria-label="補助ナビゲーション"
          >
            {showDifficultySelector && (
              <DifficultySelector currentLevel={difficultyLevel} />
            )}
            {showInterviewActions && <InterviewHeaderActions />}
            {siteConfig.features.search && (
              <Link
                href={routes.search() as Route}
                aria-label="検索"
                className="p-2 text-mirai-text-muted hover:text-mirai-text transition-colors"
              >
                <Search className="size-5" />
              </Link>
            )}
            <HamburgerMenu sessions={sessions} />
          </nav>
        </div>
      </div>
    </header>
  );
}
