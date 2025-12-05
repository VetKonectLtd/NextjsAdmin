export interface ActivityMeta {
  product_id?: number;
  user_id?: number | string;
  staff_id?: string;
  doctor_id?: number;
  forum_id?: number;
  role?: string;
}

export interface Activity {
  id: number;
  admin_id: string;
  action: string;
  title: string;
  detail: string;
  meta: ActivityMeta;
  created_at: string;
  updated_at: string;
}

export interface ActivitiesResponse {
  activities: Activity[];
}
