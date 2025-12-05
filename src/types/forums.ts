import type { PaginatedResponse } from './users';

export interface ForumAuthor {
    id: number;
    name: string;
    image: string;
    type: string;
    roles: string[];
    active_role: string;
}

export interface ForumLiker {
    id: number;
    forum_chat_id: string;
    user_id: string;
    user_type: string;
    created_at: string;
    updated_at: string;
    author: ForumAuthor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any; // Detailed user object if needed, but 'any' for now to avoid circular deps or complexity
}

export interface Forum {
    id: number;
    user_id: string;
    user_type: string;
    slug: string;
    category: string;
    title: string;
    content: string;
    image: string | null;
    status: 'in-review' | 'published' | 'archived';
    visibility: string;
    views_count: string;
    shares_count: string;
    comments_count: string;
    likes_count: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    has_liked: boolean;
    author: ForumAuthor;
    image_url: string | null;
    likers: ForumLiker[];
}

export type ForumsResponse = PaginatedResponse<Forum>;
