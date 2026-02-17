// types/email.ts

export type EmailStatus = 'queued' | 'sent' | 'failed';

export interface EmailProject {
  id: number;
  name: string;
  description: string | null;
  api_key_prefix: string;
  api_key_expires_at: string | null;
  is_active: boolean;
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface EmailProjectCreateResponse extends EmailProject {
  api_key_raw: string;
}

export interface EmailProjectCreateInput {
  name: string;
  description?: string;
  api_key_expires_at?: string;
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
}

export interface EmailProjectUpdateInput {
  name?: string;
  description?: string;
  is_active?: boolean;
  api_key_expires_at?: string;
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
}

export interface ApiKeyRotateResponse {
  api_key_raw: string;
  api_key_prefix: string;
  message: string;
}

export interface EmailLog {
  id: number;
  project_id: number;
  project_name: string | null;
  to_emails: string[];
  cc: string[] | null;
  bcc: string[] | null;
  subject: string;
  body_html: string;
  attachments_count: number;
  attachment_names: string[] | null;
  status: EmailStatus;
  error_message: string | null;
  provider_message_id: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface EmailLogListResponse {
  items: EmailLog[];
  total: number;
  page: number;
  page_size: number;
}

export interface EscalationContact {
  id: number;
  project_id: number;
  name: string;
  email: string;
  level: number;
  is_active: boolean;
  created_at: string;
}

export interface EscalationContactInput {
  name: string;
  email: string;
  level: number;
}

export interface EscalationEvent {
  id: number;
  email_log_id: number;
  contact_id: number;
  contact_name: string | null;
  contact_email: string | null;
  level: number;
  notified_at: string;
  acknowledged_at: string | null;
  project_name: string | null;
  email_subject: string | null;
  error_message: string | null;
}

export interface EscalationEventListResponse {
  items: EscalationEvent[];
  total: number;
  page: number;
  page_size: number;
}

export interface EmailDashboardStats {
  sent_today: number;
  sent_this_week: number;
  sent_this_month: number;
  failed_today: number;
  failed_this_week: number;
  failure_rate_percent: number;
  total_projects: number;
  active_projects: number;
  pending_escalations: number;
  top_projects: { name: string; total: number; sent: number; failed: number }[];
  recent_failures: {
    id: number;
    project_id: number;
    subject: string;
    to_emails: string[];
    error_message: string | null;
    created_at: string | null;
  }[];
}
