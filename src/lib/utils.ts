import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload method
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  // Download file method
  async download(endpoint: string, filename?: string): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Form field types
export interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

// Form types
export interface Form {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  isPublished: boolean;
  thankYouMessage: string;
  enableRedirect: boolean;
  redirectUrl?: string;
  autoEmailPdf: boolean;
  showPdfDownload: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormRequest {
  name: string;
  description?: string;
  fields: FormField[];
  isPublished?: boolean;
  thankYouMessage?: string;
  enableRedirect?: boolean;
  redirectUrl?: string;
  autoEmailPdf?: boolean;
  showPdfDownload?: boolean;
}

// PDF Template types
export interface PdfTemplate {
  id: string;
  name: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt: string;
}

// Field Mapping types
export interface FieldMapping {
  id: string;
  formId: string;
  templateId: string;
  fieldName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface CreateFieldMappingRequest {
  formId: string;
  templateId: string;
  fieldName: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// Submission types
export interface FormSubmission {
  id: string;
  formId: string;
  formName?: string;
  data: Record<string, any>;
  pdfPath?: string;
  submittedAt: string;
}

export interface CreateSubmissionRequest {
  formId: string;
  data: Record<string, any>;
}

// Statistics types
export interface DashboardStats {
  totalForms: number;
  publishedForms: number;
  totalTemplates: number;
  totalSubmissions: number;
  submissionsByForm: Record<string, number>;
}