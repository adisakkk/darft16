import { apiClient, type Form, type CreateFormRequest, type PdfTemplate, type FieldMapping, type FormSubmission, type DashboardStats } from '@/lib/utils';

// Forms API
export const formsApi = {
  // Get all forms
  getAll: async (): Promise<Form[]> => {
    return apiClient.get<Form[]>('/api/forms');
  },

  // Get form by ID
  getById: async (id: string): Promise<Form> => {
    return apiClient.get<Form>(`/api/forms/${id}`);
  },

  // Create new form
  create: async (data: CreateFormRequest): Promise<Form> => {
    return apiClient.post<Form>('/api/forms', data);
  },

  // Update form
  update: async (id: string, data: Partial<CreateFormRequest>): Promise<Form> => {
    return apiClient.put<Form>(`/api/forms/${id}`, data);
  },

  // Delete form
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/forms/${id}`);
  },

  // Publish form
  publish: async (id: string): Promise<Form> => {
    return apiClient.post<Form>(`/api/forms/${id}/publish`, {});
  },

  // Unpublish form
  unpublish: async (id: string): Promise<Form> => {
    return apiClient.post<Form>(`/api/forms/${id}/unpublish`, {});
  },
};

// PDF Templates API
export const templatesApi = {
  // Get all templates
  getAll: async (): Promise<PdfTemplate[]> => {
    return apiClient.get<PdfTemplate[]>('/api/templates');
  },

  // Upload template
  upload: async (file: File, name?: string): Promise<PdfTemplate> => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) {
      formData.append('name', name);
    }
    return apiClient.upload<PdfTemplate>('/api/templates', formData);
  },

  // Delete template
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/templates/${id}`);
  },
};

// Field Mappings API
export const mappingsApi = {
  // Get mappings
  get: async (formId?: string, templateId?: string): Promise<FieldMapping[]> => {
    const params = new URLSearchParams();
    if (formId) params.append('formId', formId);
    if (templateId) params.append('templateId', templateId);
    const query = params.toString();
    return apiClient.get<FieldMapping[]>(`/api/mappings${query ? `?${query}` : ''}`);
  },

  // Create mapping
  create: async (data: {
    formId: string;
    templateId: string;
    fieldName: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
  }): Promise<FieldMapping> => {
    return apiClient.post<FieldMapping>('/api/mappings', data);
  },

  // Update mapping
  update: async (id: string, data: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): Promise<FieldMapping> => {
    return apiClient.put<FieldMapping>(`/api/mappings/${id}`, data);
  },

  // Delete mapping
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/mappings/${id}`);
  },
};

// Submissions API
export const submissionsApi = {
  // Get submissions
  get: async (formId?: string): Promise<FormSubmission[]> => {
    const params = new URLSearchParams();
    if (formId) params.append('formId', formId);
    const query = params.toString();
    return apiClient.get<FormSubmission[]>(`/api/submissions${query ? `?${query}` : ''}`);
  },

  // Create submission
  create: async (data: {
    formId: string;
    data: Record<string, any>;
  }): Promise<FormSubmission> => {
    return apiClient.post<FormSubmission>('/api/submissions', data);
  },

  // Get submission by ID
  getById: async (id: string): Promise<FormSubmission> => {
    return apiClient.get<FormSubmission>(`/api/submissions/${id}`);
  },

  // Delete submission
  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/submissions/${id}`);
  },

  // Download submission PDF
  downloadPdf: async (id: string, filename?: string): Promise<void> => {
    return apiClient.download(`/api/submissions/${id}/download`, filename);
  },
};

// Statistics API
export const statsApi = {
  // Get dashboard stats
  getDashboard: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/api/stats');
  },
};