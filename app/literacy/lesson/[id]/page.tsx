import { notFound } from "next/navigation"
import { LessonPlayer } from "@/components/literacy/LessonPlayer"
import { getLessonById } from "@/lib/literacy/curriculum"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lesson = getLessonById(id)

  if (!lesson) {
    notFound()
  }

  return <LessonPlayer lesson={lesson} />
}
