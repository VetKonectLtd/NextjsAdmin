export interface SubscriptionPlan {
    id: number;
    subscription_title: string;
    subscription_code: string;
    currency: string;
    price: string;
    vat: string;
    date_option: 'Days' | 'Months';
    duration: number;
    case_record: string; // API returns string "2", payload expect integer?
    profile_approval: 'No Approval Badge' | 'Approved Badge';
    contact_info: string; // API returns "1"/"0"
    direct_message: string;
    feed_calculator: string;
    disease_predictor: string;
    store: string;
    no_of_products: string;
    customer_support: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface CreateSubscriptionPayload {
    subscription_title: string;
    subscription_code: string;
    currency: string;
    price: number;
    vat?: string;
    date_option: 'Days' | 'Months';
    duration: number;
    case_record?: number;
    profile_approval: 'No Approval Badge' | 'Approved Badge';
    contact_info: boolean;
    direct_message: boolean;
    feed_calculator: boolean;
    disease_predictor: boolean;
    store?: number;
    no_of_products?: number;
    customer_support: boolean;
}

export interface SubscriptionUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    photo?: string;
    phone?: string;
    user_type: string;
    is_active: boolean | number;
    last_seen?: string;
    // Add other fields as discovered
}

export interface SubscriptionResponse {
    message: string;
    subscriptions: {
        current_page: number;
        data: SubscriptionPlan[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface SubscriptionUsersResponse {
    type: string;
    count: number;
    users: SubscriptionUser[];
}
