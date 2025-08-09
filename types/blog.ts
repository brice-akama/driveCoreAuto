// types/blog.ts
// types/blog.ts
export interface BlogPost {
  title: Record<string, string>;
  content: Record<string, string>;
  createdAt: string;
  imageUrl?: string;
  metaTitle?: Record<string, string>;
  metaDescription?: Record<string, string>;
  slug?: Record<string, string>;
  translations?: Record<
    string,
    {
      title?: string;
      content?: string;
      metaTitle?: string;
      metaDescription?: string;
    }
  >;
}
