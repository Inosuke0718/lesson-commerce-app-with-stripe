import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Tables } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { YouTubeEmbed } from '@next/third-parties/google'
import { extractYouTubeVideoId } from "@/app/utils/extractYoutubeVideoId";

const getDetailLesson = async (id: string, supabase: SupabaseClient<Database>): Promise<Tables<'lesson'>> => {
  const { data: lesson } = await supabase.from('lesson').select('*').eq('id', id).single();
  return lesson;
}

const getPremiumContent = async (id: string, supabase: SupabaseClient<Database>): Promise<Tables<'premium_content'>> => {
  const { data: premiumContent } = await supabase.from('premium_content').select('video_url').eq('id', id).single();
  return premiumContent;
}

export default async function LessonDetailPage({ params }: { params: { id: string } }) {

  // dynamic rootではsupabaseをこの外で定義するとエラーが発生するので、ここで定義
  const supabase = createServerComponentClient<Database>({ cookies });
  // Promise.allを使用して、並列でデータをフェッチするように変更
  const [lesson, premiumContent] = await Promise.all([
    getDetailLesson(params.id, supabase),
    getPremiumContent(params.id, supabase)
  ]);
  const videoId = extractYouTubeVideoId(premiumContent?.video_url!) as string;

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{lesson?.title}</h1>
      <p className="text-lg">{lesson?.description}</p>
      <div className="w-full mx-auto" style={{ maxWidth: '640px' }}>
        <YouTubeEmbed videoid={videoId} height={400} />
      </div>
    </section>
  )
}
