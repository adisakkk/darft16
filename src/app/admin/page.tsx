'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  FileText, 
  Users, 
  Download, 
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  File,
  Database,
  Shield,
  Zap,
  Archive,
  RefreshCw
} from 'lucide-react';
import { useForms } from '@/hooks/use-forms';
import { useTemplates } from '@/hooks/use-templates';
import { useSubmissions } from '@/hooks/use-submissions';
import { useStats } from '@/hooks/use-stats';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  const { forms, updateForm, deleteForm } = useForms();
  const { templates, uploadTemplate, deleteTemplate } = useTemplates();
  const { submissions, deleteSubmission } = useSubmissions();
  const { stats } = useStats();

  const handleFormAction = (formId: string, action: 'edit' | 'view' | 'delete') => {
    switch (action) {
      case 'edit':
        router.push(`/forms/${formId}`);
        break;
      case 'view':
        router.push(`/forms/${formId}`);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this form?')) {
          deleteForm(formId);
        }
        break;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your FormFlow PDF system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/')}>
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                  <div className="text-2xl font-bold">{templates.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Available for mapping
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{submissions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Forms</CardTitle>
                  <CardDescription>Latest forms created in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {forms.slice(0, 5).map((form) => (
                      <div key={form.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{form.name}</p>
                          <p className="text-sm text-gray-600">{form.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={form.isPublished ? 'default' : 'secondary'}>
                            {form.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleFormAction(form.id, 'edit')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {forms.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No forms created yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest form submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {submission.data.fullName || submission.data.email || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600">{formatDate(submission.submittedAt)}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {submissions.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No submissions yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Management Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Forms Management</h2>
                <p className="text-gray-600">Manage all forms in the system</p>
              </div>
              <Button onClick={() => router.push('/')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Form
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium">{form.name}</h3>
                          <Badge variant={form.isPublished ? 'default' : 'secondary'}>
                            {form.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          {form.enablePdfGeneration && (
                            <Badge variant="outline">
                              <File className="h-3 w-3 mr-1" />
                              PDF
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{form.fields?.length || 0} fields</span>
                          <span>Created {formatDate(form.createdAt)}</span>
                          {form.linkedTemplateId && (
                            <span className="flex items-center">
                              <File className="h-3 w-3 mr-1" />
                              Template linked
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleFormAction(form.id, 'view')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleFormAction(form.id, 'edit')}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleFormAction(form.id, 'delete')}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {forms.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No forms created yet</h3>
                      <p className="text-gray-600 mb-4">Create your first form to get started</p>
                      <Button onClick={() => router.push('/')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Form
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would go here - Templates, Submissions, Settings, Advanced */}
          <TabsContent value="templates">
            <div className="text-center py-12">
              <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Templates Management</h3>
              <p className="text-gray-600">Template management interface coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Submissions Management</h3>
              <p className="text-gray-600">Submissions management interface coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">System Settings</h3>
              <p className="text-gray-600">Settings interface coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Advanced Settings</h3>
              <p className="text-gray-600">Advanced settings interface coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}