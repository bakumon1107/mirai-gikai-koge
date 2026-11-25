import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getLatestSessionWithBills } from "@/features/bills/server/loaders/get-latest-session-with-bills";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

/**
 * 議案が公開されている最新会期の議案一覧へリダイレクトする。
 * まだ 1 件も公開されていない場合は 404 にせず準備中画面を表示する。
 */
export default async function BillsPage() {
  if (!siteConfig.features.bills) {
    notFound();
  }

  const sessionSlug = await getLatestSessionWithBills();

  if (!sessionSlug) {
    const isArchiveLayout = siteConfig.homeLayout === "archive";

    return (
      <Container className="py-12">
        <div className="mb-6">
          <h1
            className={
              isArchiveLayout
                ? "font-rounded text-2xl font-bold text-mirai-text pc:text-3xl"
                : "text-2xl font-bold text-mirai-text"
            }
          >
            議案一覧
          </h1>
        </div>
        <div className="rounded-2xl border border-mirai-border bg-white p-8 text-center text-mirai-text-secondary">
          <p>現在、議案の解説を準備中です。</p>
          <p className="mt-2 text-sm">しばらくお待ちください。</p>
        </div>
      </Container>
    );
  }

  redirect(routes.sessionBills(sessionSlug));
}
