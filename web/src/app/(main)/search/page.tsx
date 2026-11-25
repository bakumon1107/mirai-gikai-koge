import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { SearchForm } from "@/features/search/client/components/search-form";
import { SearchResultTabs } from "@/features/search/client/components/search-result-tabs";
import { loadSearchResults } from "@/features/search/server/loaders/search-loader";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: `検索 | ${siteConfig.siteName}`,
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  if (!siteConfig.features.search) {
    notFound();
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await loadSearchResults(query) : null;
  const isArchiveLayout = siteConfig.homeLayout === "archive";

  return (
    <Container className={isArchiveLayout ? "py-8" : "py-10"}>
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
      <h1
        className={
          isArchiveLayout
            ? "font-rounded text-2xl font-bold text-mirai-text pc:text-3xl mb-6"
            : "text-2xl font-bold text-mirai-text mb-6"
        }
      >
        検索
      </h1>
      <Suspense>
        <SearchForm />
      </Suspense>
      <div className="mt-8">
        <SearchResultTabs key={query} query={query} results={results} />
      </div>
    </Container>
  );
}
