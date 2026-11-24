"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import {
  isInterviewSection,
  isMainPage,
  isWidePage,
} from "@/lib/page-layout-utils";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isMain = isMainPage(pathname);
  const useSidebarLayout = isMain && siteConfig.features.aiChat;
  const isInterview = isInterviewSection(pathname);
  const isWide = isWidePage(pathname);

  // 幅広ページ（archive トップ等）: 700px 制約と影を外してヘッダと同じ max-w-[1440px] まで使う。
  // 固定ヘッダに重ならないよう、モバイル含む全幅で上余白を確保する。
  // aiChat が有効なときは固定表示の ChatWindow（右 500px）と本文が重ならないよう余白を合成する。
  if (isWide) {
    return (
      <div
        className={cn(
          "relative max-w-[1440px] mx-auto mt-24",
          // ChatWindow は pc で right-4・幅 450px、xl では
          // right-[calc((100%-1180px)/2)] に中央寄せされる。
          // xl では右端からの距離が広がるため、pc の 500px だけでは足りない
          useSidebarLayout &&
            "pc:mr-[500px] xl:mr-[calc(calc(100vw-1180px)/2+480px)]"
        )}
      >
        {children}
      </div>
    );
  }

  // bills トップ（全面 Hero）・議案詳細（上部にサムネイル/スペーサー）・インタビュー以外は、
  // モバイル幅でも固定ヘッダ（fixed top-4 h-16）に被らないよう mt-24 を確保する。
  const topOffsetClass = !isMain && !isInterview ? "mt-24" : "md:mt-24";

  return (
    <div
      className={cn(
        "relative max-w-[700px] mx-auto",
        topOffsetClass,
        // インタビューページ以外ではshadowを表示
        !isInterview && "sm:shadow-lg",
        // TOPページと議案詳細ページのみ、チャットサイドバー用のオフセット
        useSidebarLayout && "pc:mr-[500px] xl:ml-[calc(calc(100vw-1180px)/2)]"
      )}
    >
      {children}
    </div>
  );
}
