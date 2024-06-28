import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Tables } from "@/lib/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

const getDetailLesson = async (id: string, supabase: SupabaseClient<Database>): Promise<Tables<'lesson'>> => {
  const { data: lesson } = await supabase.from('lesson').select('*').eq('id', id).single();
  return lesson;
}

export default async function LessonDetailPage({ params }: { params: { id: string } }) {

  // dynamic rootではsupabaseをこの外で定義するとエラーが発生するので、ここで定義
  const supabase = createServerComponentClient<Database>({ cookies });
  const lesson = await getDetailLesson(params.id, supabase)
  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">{lesson?.title}</h1>
      <p className="text-lg">{lesson?.description}</p>
    </section>
  )
}
