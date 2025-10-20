export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_id: number;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  meta_description: string | null;
  faq_json: any | null;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  meta_description?: string;
  faq_json?: any;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  status?: PostStatus;
  meta_description?: string;
  faq_json?: any;
}
