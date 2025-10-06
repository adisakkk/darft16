import { useState, useEffect } from 'react';
import { formsApi, type Form, type CreateFormRequest } from '@/lib/api';

export function useForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formsApi.getAll();
      setForms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  };

  const createForm = async (data: CreateFormRequest): Promise<Form | null> => {
    try {
      const newForm = await formsApi.create(data);
      setForms(prev => [...prev, newForm]);
      return newForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
      return null;
    }
  };

  const updateForm = async (id: string, data: Partial<CreateFormRequest>): Promise<Form | null> => {
    try {
      const updatedForm = await formsApi.update(id, data);
      setForms(prev => prev.map(form => 
        form.id === id ? updatedForm : form
      ));
      return updatedForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update form');
      return null;
    }
  };

  const deleteForm = async (id: string): Promise<boolean> => {
    try {
      await formsApi.delete(id);
      setForms(prev => prev.filter(form => form.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form');
      return false;
    }
  };

  const getForm = async (id: string): Promise<Form | null> => {
    try {
      const form = await formsApi.getById(id);
      return form;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch form');
      return null;
    }
  };

  const publishForm = async (id: string): Promise<Form | null> => {
    try {
      const updatedForm = await formsApi.publish(id);
      setForms(prev => prev.map(form => 
        form.id === id ? updatedForm : form
      ));
      return updatedForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish form');
      return null;
    }
  };

  const unpublishForm = async (id: string): Promise<Form | null> => {
    try {
      const updatedForm = await formsApi.unpublish(id);
      setForms(prev => prev.map(form => 
        form.id === id ? updatedForm : form
      ));
      return updatedForm;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish form');
      return null;
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return {
    forms,
    loading,
    error,
    refetch: fetchForms,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    publishForm,
    unpublishForm,
  };
}