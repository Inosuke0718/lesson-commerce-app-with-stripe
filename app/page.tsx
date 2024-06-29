import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Database, Tables } from "@/lib/database.types";

const supabase = createServerComponentClient<Database>({ cookies });

const getAllLessons = async (): Promise<Tables<'lesson'>[]> => { // lessonが複数入った配列を返す
  const { data: lessons } = await supabase.from('lesson').select('*');
  return lessons
}

export default async function Home() {
  const lessons = await getAllLessons()
  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-4">
        {lessons?.map((lesson) => (
          <Link href={`/${lesson.id}`} key={lesson.id}>
            <Card>
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{lesson.description}</p>
              </CardContent>
            </Card>
          </Link>
          
        ))}
      </div>
    </main>
  );
}

