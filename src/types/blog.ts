// Blog Author
export interface BlogAuthor {
    id: number;
    name: string;
    image: string | null;
    type: string; // 'admin', 'user', etc.
}

// Blog User (full user details)
export interface BlogUser {
    id: number;
    staff_id?: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    location?: string;
    profile_picture?: string;
    profile_picture_url?: string;
    created_at: string;
    updated_at: string;
}

// Blog Comment
export interface BlogComment {
    id: number;
    author: string;
    text: string;
    flagged: boolean;
    date: string;
}

// Blog Post
export interface Blog {
    id: number;
    user_id: string;
    user_type: string;
    slug: string;
    title: string;
    content: string;
    category: string;
    section: 'hot news' | 'normal post';
    picture: string | null;
    status: 'draft' | 'published' | 'archived' | 'rejected';
    views_count: string;
    shares_count: string;
    comments_count: string;
    likes_count: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    has_liked: boolean;
    author: BlogAuthor;
    picture_url: string | null;
    comments: BlogComment[];
    likers: unknown[];
    user: BlogUser;
}

// Paginated Blogs Response
export interface BlogsResponse {
    current_page: number;
    data: Blog[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

// Payload for creating/updating a blog
export interface CreateBlogPayload {
    title: string;
    content: string;
    category: string;
    section: 'hot news' | 'normal post';
    picture?: File | null;
}

// Flag options for blogs
export type BlogFlagType = 'none' | 'spam' | 'hidden' | 'abuse';

export interface FlagBlogPayload {
    flag: BlogFlagType;
}
