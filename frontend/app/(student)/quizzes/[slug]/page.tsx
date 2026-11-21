import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopicQuizRunner from '@/components/quiz/TopicQuizRunner';
import { QUIZ_TOPICS } from '@/components/quiz/quizTopics';

export default function TopicQuizPage({ params }: { params: { slug: string } }) {
  const topic = QUIZ_TOPICS.find((item) => item.slug === params.slug);
  if (!topic) notFound();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-12 pt-2 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><Link href="/quizzes" className="text-xs font-extrabold text-cyan-200 transition hover:text-white">← All DSA quizzes</Link><p className="mt-3 text-xs font-black uppercase tracking-[.18em] text-violet-200">Topic quiz path</p><h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">{topic.title}</h1></div>
      </div>
      <TopicQuizRunner key={topic.slug} topicTitle={topic.title} topicSlug={topic.slug} />
    </main>
  );
}
