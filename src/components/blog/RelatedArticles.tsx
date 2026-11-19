import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { getGlobalBlogPosts } from "@/lib/blog-public";

type Props = {
  currentPostId: string;
  categoryId: string | null;
};

export default async function RelatedArticles({
  currentPostId,
  categoryId,
}: Props) {
  if (!categoryId) {
    return null;
  }

  // Fetch published Global Blog articles in the
  // current article's category.
  const { posts } = await getGlobalBlogPosts(1, 50, categoryId);

  // Never recommend the article being viewed.
  const related = posts.filter((post) => post.id !== currentPostId).slice(0, 3);

  if (!related.length) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-articles-title"
      className="mt-20 border-t border-white/10 pt-12"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
            CONTINUE LEARNING
          </p>

          <h2
            id="related-articles-title"
            className="mt-3 text-3xl font-semibold text-white sm:text-4xl"
          >
            Related Articles
          </h2>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D5FF66] hover:text-[#C5EF53]"
        >
          All Articles
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {related.map((post) => (
          <article
            key={post.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#181C1E] transition-colors hover:border-[#D5FF66]/40"
          >
            <Link href={`/blog/${post.slug}`} className="block h-full">
              <div className="aspect-[16/10] overflow-hidden bg-[#24292B]">
                {post.featured_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featured_image}
                    alt={post.featured_image_alt || ""}
                    loading="lazy"
                    className="nextwave-blog-card-image"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen size={38} className="text-[#D5FF66]/50" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#D5FF66]">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/55">
                  {post.excerpt ||
                    "Explore more practical learning resources from NextWave Build."}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D5FF66]">
                  Read Article
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
