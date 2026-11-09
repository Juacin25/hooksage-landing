import { existsSync } from "node:fs";
import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

// Byline for every post. Replace with a real person (name + role) once founders are public.
export const blogAuthor = {
  name: "Equipo de Hooksage",
  url: "https://hooksage.com/#quienes-somos",
};

export async function getPosts() {
  return (await getCollection("blog")).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export const postPath = (post: Post) => `/blog/${post.id}/`;
export const postUrl = (post: Post) => `https://hooksage.com${postPath(post)}`;

// Covers are optional: drop public/blog/covers/<slug>.webp (16:9) and rebuild.
export function coverPath(post: Post) {
  const file = `/blog/covers/${post.id}.webp`;
  return existsSync(`public${file}`) ? file : undefined;
}

export function readingMinutes(post: Post) {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (date: Date) =>
  date.toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function relatedPosts(post: Post, posts: Post[], count = 3) {
  const sameCategory = posts.filter(
    (other) =>
      other.id !== post.id && other.data.category === post.data.category,
  );
  const rest = posts.filter(
    (other) =>
      other.id !== post.id && other.data.category !== post.data.category,
  );
  return [...sameCategory, ...rest].slice(0, count);
}
