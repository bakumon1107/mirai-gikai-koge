import { createAdminClient } from "../shared/helper";
import {
  KOGE_COMMITTEES,
  KOGE_R8_1_BILLS,
  KOGE_R8_1_URLS,
  KOGE_TAGS,
} from "./r8-01-bills";
import { KOGE_R8_1_QUESTIONS } from "./r8-01-questions";

/**
 * 上毛町議会 令和8年（2026年）第1回定例会（3月定例会）実データ投入スクリプト
 *
 * - 冪等（何度実行しても既存レコードを安全に upsert する）
 * - 出典: 上毛町公式サイト（議決結果一覧表 PDF・会議録 1〜3日目 PDF）
 * - 原文（raw_text / answer_raw_text）は投入せず、要約＋公式出典リンクのみを格納する
 */
async function main() {
  const supabase = createAdminClient();
  console.log("🌿 上毛町議会 令和8年第1回定例会（3月）データを投入します...");

  // 1. 会期（council_sessions）を upsert
  const { data: session, error: sessionError } = await supabase
    .from("council_sessions")
    .upsert(
      {
        slug: "r8-03",
        name: "令和8年 3月定例会（第1回）",
        start_date: "2026-03-03",
        end_date: "2026-03-13",
        council_url: KOGE_R8_1_URLS.voteResultPage,
        is_active: true,
        schedule_milestones: {
          generalQuestions: { from: "2026-03-05", to: "2026-03-05" },
          standingCommittees: { from: "2026-03-06", to: "2026-03-10" },
          billVote: "2026-03-13",
        },
      },
      { onConflict: "slug" }
    )
    .select("id, name, slug")
    .single();

  if (sessionError || !session) {
    throw new Error(`会期の登録に失敗しました: ${sessionError?.message}`);
  }

  const { error: activeError } = await supabase.rpc(
    "set_active_council_session",
    { target_session_id: session.id }
  );
  if (activeError) {
    throw new Error(
      `アクティブ会期の設定に失敗しました: ${activeError.message}`
    );
  }
  console.log(`✅ 会期: ${session.name} (${session.slug})`);

  // 2. 常任委員会（committees）を upsert
  const committeeIdByName = new Map<string, string>();
  for (const name of KOGE_COMMITTEES) {
    const { data: existing } = await supabase
      .from("committees")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      committeeIdByName.set(name, existing.id);
    } else {
      const { data: inserted, error } = await supabase
        .from("committees")
        .insert({ name })
        .select("id")
        .single();
      if (error || !inserted) {
        throw new Error(`委員会 ${name} の登録に失敗: ${error?.message}`);
      }
      committeeIdByName.set(name, inserted.id);
    }
  }
  console.log(`✅ 委員会: ${committeeIdByName.size}件`);

  // 3. タグ（tags）を upsert
  const tagIdByLabel = new Map<string, string>();
  for (const tag of KOGE_TAGS) {
    const { data: upserted, error } = await supabase
      .from("tags")
      .upsert(tag, { onConflict: "label" })
      .select("id, label")
      .single();
    if (error || !upserted) {
      throw new Error(`タグ ${tag.label} の登録に失敗: ${error?.message}`);
    }
    tagIdByLabel.set(upserted.label, upserted.id);
  }
  console.log(`✅ タグ: ${tagIdByLabel.size}件`);

  // 4. 議案（bills）・難易度別解説（bill_contents）・タグ紐付け（bills_tags）
  let billCount = 0;
  for (const item of KOGE_R8_1_BILLS) {
    const committeeId = item.committee
      ? (committeeIdByName.get(item.committee) ?? null)
      : null;

    const { data: existingBill } = await supabase
      .from("bills")
      .select("id")
      .eq("bill_number", item.billNumber)
      .maybeSingle();

    let billId: string;
    const payload = {
      name: item.name,
      bill_number: item.billNumber,
      status: item.status,
      status_note: item.statusNote,
      publish_status: "published" as const,
      published_at: item.publishedAt,
      is_featured: item.isFeatured,
      pdf_url: KOGE_R8_1_URLS.voteResultPdf,
      council_session_id: session.id,
      committee_id: committeeId,
    };

    if (existingBill) {
      const { error } = await supabase
        .from("bills")
        .update(payload)
        .eq("id", existingBill.id);
      if (error) {
        throw new Error(
          `議案 ${item.billNumber} の更新に失敗: ${error.message}`
        );
      }
      billId = existingBill.id;
    } else {
      const { data: inserted, error } = await supabase
        .from("bills")
        .insert(payload)
        .select("id")
        .single();
      if (error || !inserted) {
        throw new Error(
          `議案 ${item.billNumber} の登録に失敗: ${error?.message}`
        );
      }
      billId = inserted.id;
    }

    // bill_contents (normal & hard)
    const { error: contentError } = await supabase.from("bill_contents").upsert(
      [
        {
          bill_id: billId,
          difficulty_level: "normal",
          title: item.normal.title,
          summary: item.normal.summary,
          content: item.normal.content,
        },
        {
          bill_id: billId,
          difficulty_level: "hard",
          title: item.hard.title,
          summary: item.hard.summary,
          content: item.hard.content,
        },
      ],
      { onConflict: "bill_id,difficulty_level" }
    );
    if (contentError) {
      throw new Error(
        `議案解説 ${item.billNumber} の登録に失敗: ${contentError.message}`
      );
    }

    // bills_tags を同期（既存を外してから現在のタグを登録）
    const { error: delTagError } = await supabase
      .from("bills_tags")
      .delete()
      .eq("bill_id", billId);
    if (delTagError) {
      throw new Error(
        `議案タグ削除 ${item.billNumber} に失敗: ${delTagError.message}`
      );
    }

    const tagRows = item.tags
      .map((label) => tagIdByLabel.get(label))
      .filter((id): id is string => Boolean(id))
      .map((tag_id) => ({ bill_id: billId, tag_id }));

    if (tagRows.length > 0) {
      const { error: tagErr } = await supabase
        .from("bills_tags")
        .insert(tagRows);
      if (tagErr) {
        throw new Error(
          `議案タグ登録 ${item.billNumber} に失敗: ${tagErr.message}`
        );
      }
    }

    billCount++;
  }
  console.log(`✅ 議案・解説（normal/hard）: ${billCount}件`);

  // 5. 一般質問（general_questions）を upsert（原文は格納しない）
  let questionCount = 0;
  let topicCount = 0;
  for (const q of KOGE_R8_1_QUESTIONS) {
    const { error } = await supabase.from("general_questions").upsert(
      {
        council_session_id: session.id,
        question_type: q.question_type,
        questioner_name: q.questioner_name,
        questioner_party: q.questioner_party,
        questioner_number: q.questioner_number,
        session_day: q.session_day,
        question_order: q.question_order,
        summary: q.summary,
        topics: q.topics,
        raw_text: null,
        answer_raw_text: null,
        source_url: q.source_url,
        publish_status: "published",
      },
      { onConflict: "council_session_id,session_day,question_order" }
    );
    if (error) {
      throw new Error(
        `一般質問（${q.questioner_name}）の登録に失敗: ${error.message}`
      );
    }
    questionCount++;
    topicCount += q.topics.length;
  }
  console.log(`✅ 一般質問: ${questionCount}名（計${topicCount}トピック）`);
  console.log("🎉 上毛町 令和8年第1回定例会データの投入が完了しました！");
}

main().catch((err) => {
  console.error("❌ データ投入エラー:", err);
  process.exit(1);
});

