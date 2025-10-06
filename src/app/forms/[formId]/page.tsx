'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Share2, 
  Download, 
  Settings,
  FileText,
  Map,
  BarChart3,
  Users,
  Copy,
  ExternalLink,
  QrCode,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Trash2,
  Edit
} from 'lucide-react';
import { useForms } from '@/hooks/use-forms';
import FormBuilder from '@/components/forms/FormBuilder';
import FieldMappingInterface from '@/components/mapping/FieldMappingInterface';

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getForm, updateForm, deleteForm, publishForm, unpublishForm } = useForms();

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const form = await getForm(formId);
      setFormData(form);
    } catch (error) {
      console.error('Failed to load form:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForm = async (updatedData: any) => {
    try {
      await updateForm(formId, updatedData);
      await loadForm(); // Reload form data
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save form:', error);
    }
  };

  const handleDeleteForm = async () => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await deleteForm(formId);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete form:', error);
      }
    }
  };

  const handlePublish = async () => {
    try {
      await publishForm(formId);
      await loadForm();
    } catch (error) {
      console.error('Failed to publish form:', error);
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishForm(formId);
      await loadForm();
    } catch (error) {
      console.error('Failed to unpublish form:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">Form not found</p>
          <Button className="mt-4" onClick={() => router.push('/')}>
            Go back to dashboard
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{formData.name}</h1>
                  <p className="text-sm text-gray-600">{formData.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={formData.isPublished ? 'default' : 'secondary'}>
                {formData.isPublished ? 'Published' : 'Draft'}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button 
                variant={formData.isPublished ? 'destructive' : 'default'}
                size="sm"
                onClick={formData.isPublished ? handleUnpublish : handlePublish}
              >
                {formData.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteForm}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Form</h2>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
            <FormBuilder
              onSave={handleSaveForm}
              initialForm={formData}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="mapping">Mapping</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
              <TabsTrigger value="submissions">Responses</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Form Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm text-gray-600">{formData.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-gray-600">{formData.description || 'No description'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">
                        <Badge variant={formData.isPublished ? 'default' : 'secondary'}>
                          {formData.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm text-gray-600">{formatDate(formData.createdAt)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p className="text-sm text-gray-600">{formatDate(formData.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Total Fields</Label>
                      <p className="text-2xl font-bold">{formData.fields?.length || 0}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Submissions</Label>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Conversion Rate</Label>
                      <p className="text-2xl font-bold">0%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Share2 className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('builder')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Form
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('publish')}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Publish Form
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setActiveTab('submissions')}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Responses
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Form Builder</h2>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Form
                  </Button>
                </div>
                <FormBuilder
                  onSave={handleSaveForm}
                  initialForm={formData}
                  previewMode={true}
                />
              </div>
            </TabsContent>

            {/* Mapping Tab */}
            <TabsContent value="mapping">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Field Mapping</h2>
                  <p className="text-gray-600">Map form fields to PDF template positions</p>
                </div>
                <FieldMappingInterface formId={formId} />
              </div>
            </TabsContent>

            {/* Publish Tab */}
            <TabsContent value="publish" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Publish Form</h2>
                <p className="text-gray-600">Share your form with users</p>
              </div>

              {formData.isPublished ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Share2 className="h-5 w-5" />
                        <span>Published Form</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Form URL</Label>
                        <div className="flex space-x-2 mt-1">
                          <Input 
                            value={`${window.location.origin}/f/${formId}`}
                            readOnly
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(`${window.location.origin}/f/${formId}`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/f/${formId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Embed Code</Label>
                        <div className="mt-1">
                          <Textarea
                            value={`<iframe src="${window.location.origin}/f/${formId}" width="100%" height="600" frameborder="0"></iframe>`}
                            readOnly
                            rows={3}
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => copyToClipboard(`<iframe src="${window.location.origin}/f/${formId}" width="100%" height="600" frameborder="0"></iframe>`)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Embed Code
                          </Button>
                        </div>
                      </div>

                      {formData.qrCode && (
                        <div>
                          <Label className="text-sm font-medium">QR Code</Label>
                          <div className="mt-2">
                            <img src={formData.qrCode} alt="QR Code" className="w-32 h-32" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Form Not Published</h3>
                    <p className="text-gray-600 mb-4">Publish this form to get sharing options</p>
                    <Button onClick={handlePublish}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Publish Form
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Form Submissions</h2>
                  <p className="text-gray-600">View and manage form responses</p>
                </div>
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Submissions Yet</h3>
                    <p className="text-gray-600">Once users submit your form, their responses will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Form Settings</h2>
                <p className="text-gray-600">Configure form behavior and options</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submission Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="thankYouMessage">Thank You Message</Label>
                      <Textarea
                        id="thankYouMessage"
                        value={formData.thankYouMessage || ''}
                        onChange={(e) => setFormData({...formData, thankYouMessage: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableRedirect"
                        checked={formData.enableRedirect || false}
                        onCheckedChange={(checked) => setFormData({...formData, enableRedirect: checked})}
                      />
                      <Label htmlFor="enableRedirect">Enable Redirect</Label>
                    </div>

                    {formData.enableRedirect && (
                      <div>
                        <Label htmlFor="redirectUrl">Redirect URL</Label>
                        <Input
                          id="redirectUrl"
                          value={formData.redirectUrl || ''}
                          onChange={(e) => setFormData({...formData, redirectUrl: e.target.value})}
                          placeholder="https://example.com/thank-you"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>PDF Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoEmailPdf"
                        checked={formData.autoEmailPdf || false}
                        onCheckedChange={(checked) => setFormData({...formData, autoEmailPdf: checked})}
                      />
                      <Label htmlFor="autoEmailPdf">Auto Email PDF</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showPdfDownload"
                        checked={formData.showPdfDownload !== false}
                        onCheckedChange={(checked) => setFormData({...formData, showPdfDownload: checked})}
                      />
                      <Label htmlFor="showPdfDownload">Show PDF Download</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveForm(formData)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}