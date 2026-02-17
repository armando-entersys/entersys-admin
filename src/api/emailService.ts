// api/emailService.ts
import { api } from '../lib/axios';
import type {
  EmailProject,
  EmailProjectCreateResponse,
  EmailProjectCreateInput,
  EmailProjectUpdateInput,
  ApiKeyRotateResponse,
  EmailLogListResponse,
  EmailLog,
  EscalationContact,
  EscalationContactInput,
  EscalationEventListResponse,
  EmailDashboardStats,
} from '../types/email';

export const emailServiceApi = {
  // ── Dashboard ──
  async getStats(): Promise<EmailDashboardStats> {
    const { data } = await api.get<EmailDashboardStats>('/email-admin/stats');
    return data;
  },

  // ── Projects ──
  async getProjects(): Promise<EmailProject[]> {
    const { data } = await api.get<EmailProject[]>('/email-admin/projects');
    return data;
  },

  async getProject(id: number): Promise<EmailProject> {
    const { data } = await api.get<EmailProject>(`/email-admin/projects/${id}`);
    return data;
  },

  async createProject(input: EmailProjectCreateInput): Promise<EmailProjectCreateResponse> {
    const { data } = await api.post<EmailProjectCreateResponse>('/email-admin/projects', input);
    return data;
  },

  async updateProject(id: number, input: EmailProjectUpdateInput): Promise<EmailProject> {
    const { data } = await api.put<EmailProject>(`/email-admin/projects/${id}`, input);
    return data;
  },

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/email-admin/projects/${id}`);
  },

  async rotateApiKey(id: number): Promise<ApiKeyRotateResponse> {
    const { data } = await api.post<ApiKeyRotateResponse>(`/email-admin/projects/${id}/rotate-key`);
    return data;
  },

  // ── Logs ──
  async getLogs(params: {
    project_id?: number;
    status?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<EmailLogListResponse> {
    const { data } = await api.get<EmailLogListResponse>('/email-admin/logs', { params });
    return data;
  },

  async getLog(id: number): Promise<EmailLog> {
    const { data } = await api.get<EmailLog>(`/email-admin/logs/${id}`);
    return data;
  },

  // ── Escalation Contacts ──
  async getEscalationContacts(projectId: number): Promise<EscalationContact[]> {
    const { data } = await api.get<EscalationContact[]>(
      `/email-admin/projects/${projectId}/escalation-contacts`
    );
    return data;
  },

  async createEscalationContact(projectId: number, input: EscalationContactInput): Promise<EscalationContact> {
    const { data } = await api.post<EscalationContact>(
      `/email-admin/projects/${projectId}/escalation-contacts`,
      input
    );
    return data;
  },

  async updateEscalationContact(contactId: number, input: Partial<EscalationContactInput & { is_active: boolean }>): Promise<EscalationContact> {
    const { data } = await api.put<EscalationContact>(
      `/email-admin/escalation-contacts/${contactId}`,
      input
    );
    return data;
  },

  async deleteEscalationContact(contactId: number): Promise<void> {
    await api.delete(`/email-admin/escalation-contacts/${contactId}`);
  },

  // ── Escalation Events ──
  async getEscalationEvents(params: {
    project_id?: number;
    page?: number;
    page_size?: number;
  }): Promise<EscalationEventListResponse> {
    const { data } = await api.get<EscalationEventListResponse>('/email-admin/escalation-events', { params });
    return data;
  },

  async acknowledgeEvent(eventId: number): Promise<void> {
    await api.post(`/email-admin/escalation-events/${eventId}/acknowledge`);
  },
};
