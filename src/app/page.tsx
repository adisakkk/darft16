'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Users, 
  Download, 
  Share2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Map,
  Settings,
  Inbox,
  BarChart3,
  File,
  Calendar,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import { useForms } from '@/hooks/use-forms';
import { useTemplates } from '@/hooks/use-templates';
import { useSubmissions } from '@/hooks/use-submissions';
import { useStats } from '@/hooks/use-stats';
import FormBuilder from '@/components/forms/FormBuilder';
import FieldMappingInterface from '@/components/mapping/FieldMappingInterface';

export default function FormFlowDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingForm, setEditingForm] = useState<any>(null);

  // Custom hooks for data fetching
  const { forms, loading: formsLoading, createForm, updateForm, deleteForm } = useForms();
  const { templates, loading: templatesLoading, uploadTemplate, deleteTemplate } = useTemplates();
  const { submissions, loading: submissionsLoading, deleteSubmission, downloadPdf } = useSubmissions();
  const { stats, loading: statsLoading } = useStats();

  const isLoading = formsLoading || templatesLoading || submissionsLoading || statsLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleCreateForm = () => {
    setEditingForm(null);
    setActiveTab('form-builder');
  };

  const handleEditForm = (form: any) => {
    setEditingForm(form);
    setActiveTab('form-builder');
  };

  const handleSaveForm = async (formData: any) => {
    if (editingForm) {
      await updateForm(editingForm.id, formData);
    } else {
      await createForm(formData);
    }
    setEditingForm(null);
    setActiveTab('dashboard');
  };

  const handleDeleteForm = async (id: string) => {
    if (confirm('Are you sure you want to delete this form?')) {
      await deleteForm(id);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(id);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await deleteSubmission(id);
    }
  };

  const handleDownloadPdf = async (id: string, fileName: string) => {
    await downloadPdf(id, `submission_${id}.pdf`);
  };

  const handleUploadTemplate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadTemplate(file);
      event.target.value = ''; // Reset input
    }
  };

  const handleExportCsv = async () => {
    try {
      const formId = ''; // Export all submissions, or specify a form ID
      const params = formId ? `?formId=${formId}` : '';
      window.open(`/api/submissions/export${params}`, '_blank');
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading FormFlow PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">FormFlow PDF</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/admin')}>
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {[
              { id: 'dashboard', label: 'Overview', icon: BarChart3 },
              { id: 'form-builder', label: 'Build', icon: FileText },
              { id: 'pdf-templates', label: 'Templates', icon: File },
              { id: 'field-mapping', label: 'Map', icon: Map },
              { id: 'publishing', label: 'Publish', icon: Share2 },
              { id: 'submissions', label: 'Responses', icon: Inbox }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalForms || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.publishedForms || 0} published
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">PDF Templates</CardTitle>
                  <File className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalTemplates || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for mapping
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Forms</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.publishedForms || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Active forms
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest form submissions from your users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {submission.data.fullName || submission.data.email || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600">{submission.formName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(submission.submittedAt)}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadPdf(submission.id, submission.formName || 'submission')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Builder Tab */}
        {activeTab === 'form-builder' && (
          <FormBuilder
            onSave={handleSaveForm}
            initialForm={editingForm}
          />
        )}

        {/* PDF Templates Tab */}
        {activeTab === 'pdf-templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">PDF Templates</h2>
                <p className="text-gray-600">Upload and manage your PDF templates</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleUploadTemplate}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="template-upload"
                />
                <Button asChild>
                  <label htmlFor="template-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Template
                  </label>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <File className="h-5 w-5 text-red-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{template.fileName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(template.fileSize)}</p>
                      <p className="text-xs text-gray-500">Uploaded {formatDate(template.createdAt)}</p>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No PDF templates uploaded yet</p>
                  <Button className="mt-4" onClick={() => document.getElementById('template-upload')?.click()}>
                    Upload your first template
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Field Mapping Tab */}
        {activeTab === 'field-mapping' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Field Mapping</h2>
              <p className="text-gray-600">Map form fields to PDF template locations</p>
            </div>
            <FieldMappingInterface />
          </div>
        )}

        {/* Publishing Tab */}
        {activeTab === 'publishing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Publishing Options</h2>
              <p className="text-gray-600">Configure how your forms are shared and accessed</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Share Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Form URL</label>
                      <div className="flex mt-1">
                        <input
                          type="text"
                          value="https://formflowpdf.com/f/a1B2c3D4"
                          readOnly
                          className="flex-1 px-3 py-2 border border-r-0 rounded-l-md bg-gray-50"
                        />
                        <Button className="rounded-l-none">Copy</Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Embed Code</label>
                      <textarea
                        readOnly
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50 h-24 text-sm"
                        value={`<iframe src="https://formflowpdf.com/f/a1B2c3D4" width="100%" height="500" frameborder="0"></iframe>`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thank You Page</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        rows={3}
                        defaultValue="Thanks for completing the form! We'll be in touch shortly."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="redirect" className="rounded" />
                      <label htmlFor="redirect" className="text-sm">Redirect to URL after submission</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-pdf" className="rounded" />
                      <label htmlFor="email-pdf" className="text-sm">Email PDF copy to respondents</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="download-pdf" className="rounded" defaultChecked />
                      <label htmlFor="download-pdf" className="text-sm">Show instant PDF download</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Form Submissions</h2>
                <p className="text-gray-600">View and manage all form submissions</p>
              </div>
              <Button variant="outline" onClick={handleExportCsv}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Form Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{submission.id.slice(-6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.formName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.data.fullName || submission.data.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {submission.data.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(submission.submittedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadPdf(submission.id, submission.formName || 'submission')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSubmission(submission.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {submissions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}