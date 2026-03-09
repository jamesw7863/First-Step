export type WorkStyle = "remote" | "hybrid" | "onsite" | "any";

export interface PreferencePayload {
  email: string;
  school: string;
  major: string;
  graduationYear: number;
  internshipTypes: string[];
  keywords: string[];
  locations: string[];
  workStyle: WorkStyle;
}

export interface InternshipRecord {
  id?: number;
  source_id: string;
  title: string;
  company: string;
  location: string;
  work_style: WorkStyle;
  posted_date: string | null;
  discovered_at?: string;
  apply_url: string;
  description_snippet: string;
  category_tags: string[];
  hash_key: string;
}

export interface UserProfile {
  user_id: string;
  major: string;
  internship_types: string[];
  keywords: string[];
  locations: string[];
  work_style: WorkStyle;
}
