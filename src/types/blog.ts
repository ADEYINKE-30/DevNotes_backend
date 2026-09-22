export interface BlogPostDocument {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image?: string;
  author: string;
  readTime: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostInput {
  title: string;
  description: string;
  content: string;
  category: string;
  image?: string;
  author?: string;
  readTime?: string;
  published?: boolean;
}
