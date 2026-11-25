import "server-only";
import {
  Baby,
  Shield,
  Heart,
  Leaf,
  Circle,
  ArrowRight,
  Stethoscope,
  Building2,
  Trophy,
  Globe,
  Sprout,
  Scale,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { GeneralQuestion } from "../../shared/types";
import { buildTopicGroups } from "../../shared/utils/build-topic-groups";
import type {
  TopicEntry,
  TopicGroup,
} from "../../shared/utils/build-topic-groups";
import { GeneralQuestionList } from "./general-question-list";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Baby,
  Shield,
  Heart,
  Stethoscope,
  Building2,
  Leaf,
  Trophy,
  Globe,
  Sprout,
  Scale,
  Landmark,
  Circle,
};

const CATEGORY_STYLE: Record<
  string,
  { card: string; header: string; text: string; iconBg: string }
> = {
  "子育て・教育": {
    card: "bg-sky-50 border-sky-200",
    header: "bg-white/60 border-sky-200",
    text: "text-sky-700",
    iconBg: "bg-sky-100",
  },
  "防災・安全": {
    card: "bg-orange-50 border-orange-200",
    header: "bg-white/60 border-orange-200",
    text: "text-orange-700",
    iconBg: "bg-orange-100",
  },
  "高齢者・福祉": {
    card: "bg-rose-50 border-rose-200",
    header: "bg-white/60 border-rose-200",
    text: "text-rose-700",
    iconBg: "bg-rose-100",
  },
  "健康・医療": {
    card: "bg-teal-50 border-teal-200",
    header: "bg-white/60 border-teal-200",
    text: "text-teal-700",
    iconBg: "bg-teal-100",
  },
  "交通・まちづくり": {
    card: "bg-violet-50 border-violet-200",
    header: "bg-white/60 border-violet-200",
    text: "text-violet-700",
    iconBg: "bg-violet-100",
  },
  "環境・脱炭素": {
    card: "bg-emerald-50 border-emerald-200",
    header: "bg-white/60 border-emerald-200",
    text: "text-emerald-700",
    iconBg: "bg-emerald-100",
  },
  "スポーツ・文化": {
    card: "bg-indigo-50 border-indigo-200",
    header: "bg-white/60 border-indigo-200",
    text: "text-indigo-700",
    iconBg: "bg-indigo-100",
  },
  "観光・地域振興": {
    card: "bg-amber-50 border-amber-200",
    header: "bg-white/60 border-amber-200",
    text: "text-amber-700",
    iconBg: "bg-amber-100",
  },
  "産業・農林水産": {
    card: "bg-lime-50 border-lime-200",
    header: "bg-white/60 border-lime-200",
    text: "text-lime-700",
    iconBg: "bg-lime-100",
  },
  "警察・人権": {
    card: "bg-slate-50 border-slate-200",
    header: "bg-white/60 border-slate-200",
    text: "text-slate-700",
    iconBg: "bg-slate-100",
  },
  "行政・議会": {
    card: "bg-cyan-50 border-cyan-200",
    header: "bg-white/60 border-cyan-200",
    text: "text-cyan-700",
    iconBg: "bg-cyan-100",
  },
};

const DEFAULT_STYLE = {
  card: "bg-mirai-surface-muted border-border",
  header: "bg-card border-border",
  text: "text-mirai-text-secondary",
  iconBg: "bg-card",
};

function TopicCard({
  entry,
  style,
}: {
  entry: TopicEntry;
  style: typeof DEFAULT_STYLE;
}) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-xl border ${style.card} overflow-hidden`}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-2 mb-2">
          <h3 className={`text-base font-bold ${style.text} flex-1`}>
            {entry.title}
          </h3>
          {entry.topicCount > 1 && (
            <span
              className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full ${style.iconBg} ${style.text}`}
            >
              {entry.topicCount}件
            </span>
          )}
        </div>
        <p className="text-sm text-mirai-text leading-relaxed">
          {entry.answerSummary}
        </p>
      </div>
      <div
        className={`px-4 py-2.5 border-t ${style.header} flex items-center justify-between gap-2`}
      >
        <p className="text-xs text-mirai-text-secondary line-clamp-1 flex-1">
          {entry.questioner.name}議員の質問より
        </p>
        <Link
          href={routes.questionDetail(entry.questioner.id)}
          className={`inline-flex items-center gap-1 text-xs font-medium ${style.text} hover:underline shrink-0`}
        >
          質疑の詳細
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function CategorySection({ group }: { group: TopicGroup }) {
  const Icon = ICON_MAP[group.iconName] ?? Circle;
  const style = CATEGORY_STYLE[group.categoryLabel] ?? DEFAULT_STYLE;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${style.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${style.text}`} />
        </div>
        <h2 className={`font-bold ${style.text}`}>{group.categoryLabel}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 pc:grid-cols-3">
        {group.entries.map((entry, i) => (
          <TopicCard key={`${entry.title}-${i}`} entry={entry} style={style} />
        ))}
      </div>
    </section>
  );
}

interface SessionTopicsViewProps {
  questions: GeneralQuestion[];
}

export function SessionTopicsView({ questions }: SessionTopicsViewProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-mirai-text-secondary">
        <p>現在、代表質問・一般質問のデータを準備中です。</p>
        <p className="text-sm mt-2">しばらくお待ちください。</p>
      </div>
    );
  }

  const groups = buildTopicGroups(questions);
  const questionsWithoutTopics = questions.filter((q) => q.topics.length === 0);

  if (groups.length === 0) {
    return <GeneralQuestionList questions={questions} />;
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-[24px] bg-white p-4 pc:p-5 border border-archive-divider">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-mirai-text">
            登壇議員から見る（{questions.length}名）
          </h2>
          <span className="text-xs text-mirai-text-secondary">
            議員名を選ぶと質疑のやり取り全文要約へ移動します
          </span>
        </div>
        <ul className="flex flex-wrap gap-2">
          {questions.map((q) => (
            <li key={q.id}>
              <Link
                href={routes.questionDetail(q.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-archive-surface-sub px-3.5 py-1.5 text-sm font-medium text-mirai-text hover:bg-archive-pill-bg hover:text-archive-pill-text transition-colors"
              >
                <span>{q.questioner_name} 議員</span>
                {q.topics.length > 0 && (
                  <span className="text-xs text-mirai-text-secondary">
                    （{q.topics.length}件）
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {groups.map((group) => (
        <CategorySection key={group.categoryLabel} group={group} />
      ))}
      {questionsWithoutTopics.length > 0 && (
        <section>
          <h2 className="font-bold text-mirai-text mb-4">
            トピック未分類の質問
          </h2>
          <GeneralQuestionList questions={questionsWithoutTopics} />
        </section>
      )}
    </div>
  );
}
