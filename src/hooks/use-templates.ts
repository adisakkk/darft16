import { useState, useEffect } from 'react';
import { templatesApi, type PdfTemplate } from '@/lib/api';

export function useTemplates() {
  const [templates, setTemplates] = useState<PdfTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templatesApi.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const uploadTemplate = async (file: File, name?: string): Promise<PdfTemplate | null> => {
    try {
      setUploading(true);
      const newTemplate = await templatesApi.upload(file, name);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload template');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      await templatesApi.delete(id);
      setTemplates(prev => prev.filter(template => template.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      return false;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    uploading,
    refetch: fetchTemplates,
    uploadTemplate,
    deleteTemplate,
  };
}