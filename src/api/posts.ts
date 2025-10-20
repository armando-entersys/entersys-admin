import { api } from '../lib/axios';
import type { Post, CreatePostInput, UpdatePostInput } from '../types/post';

export const postsApi = {
  async getAll(publishedOnly = false): Promise<Post[]> {
    const { data } = await api.get<Post[]>('/posts', {
      params: { published_only: publishedOnly },
    });
    return data;
  },

  async getById(id: number): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  },

  async getBySlug(slug: string): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${slug}`);
    return data;
  },

  async create(input: CreatePostInput): Promise<Post> {
    const { data } = await api.post<Post>('/posts', input);
    return data;
  },

  async update(id: number, input: UpdatePostInput): Promise<Post> {
    const { data } = await api.put<Post>(`/posts/${id}`, input);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
