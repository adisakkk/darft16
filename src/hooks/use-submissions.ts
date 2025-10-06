import { useState, useEffect } from 'react';
import { submissionsApi, type FormSubmission } from '@/lib/api';

export function useSubmissions(formId?: string) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await submissionsApi.get(formId);
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const createSubmission = async (data: {
    formId: string;
    data: Record<string, any>;
  }): Promise<FormSubmission | null> => {
    try {
      const newSubmission = await submissionsApi.create(data);
      setSubmissions(prev => [...prev, newSubmission]);
      return newSubmission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create submission');
      return null;
    }
  };

  const deleteSubmission = async (id: string): Promise<boolean> => {
    try {
      await submissionsApi.delete(id);
      setSubmissions(prev => prev.filter(submission => submission.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete submission');
      return false;
    }
  };

  const downloadPdf = async (id: string, filename?: string): Promise<void> => {
    try {
      await submissionsApi.downloadPdf(id, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [formId]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    createSubmission,
    deleteSubmission,
    downloadPdf,
  };
}