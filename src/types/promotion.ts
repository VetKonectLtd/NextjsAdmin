export interface PromotionPlan {
  id: number;
  promotion_code: string;
  title: string;
  currency: string;
  price: string;
  vat: string | number;
  date_option: 'Days' | 'Months';
  duration: number;
  no_of_products: string | number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreatePromotionPayload {
  title: string;
  currency: string;
  price: number;
  vat?: number;
  date_option: 'Days' | 'Months';
  duration: number;
  no_of_products: number;
  status: 'active' | 'inactive';
}

export interface PromotionResponse {
  plans: {
    current_page: number;
    data: PromotionPlan[];
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

export interface PromotionProduct {
  id: number;
  user_id: string;
  store_id: string;
  product_id: string;
  product_type: string;
  product_name: string;
  category: string;
  description: string;
  location: string;
  price: string;
  images: string[];
  availability: boolean;
  available_unit: string;
  is_featured: boolean;
  is_verified: boolean;
  disabled: string; // "0" or "1"
  images_url: string[];
}

export interface UserPromotion {
  id: number;
  user_id: string;
  product_id: string;
  promotion_plan_id: string;
  active_role: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  computed_status: string; // 'expired', 'active', etc.
  product: PromotionProduct;
  promotion_plan: PromotionPlan;
}

export interface PromotionUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_num: string;
  state: string;
  country: string;
  activeRoleName: string;
  profile?: {
    profile_image_url: string;
  };
}

export interface PromotionUserData {
  user: PromotionUser;
  promotions: UserPromotion[];
}

export interface PromotionUsersResponse {
  title: string;
  count: number;
  data: PromotionUserData[];
}
