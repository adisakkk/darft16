'use client';

import { useState } from 'react';
import FormBuilder from '@/components/forms/FormBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Sparkles, Zap, Settings, Upload } from 'lucide-react';

export default function FormBuilderDemo() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [savedForm, setSavedForm] = useState<any>(null);

  const handleSaveForm = (formData: any) => {
    console.log('Form saved:', formData);
    setSavedForm(formData);
    setShowBuilder(false);
  };

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="border-b bg-white p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowBuilder(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Form Builder</h1>
              <p className="text-gray-600">Try our new multi-date picker and improved UX!</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
        <FormBuilder onSave={handleSaveForm} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Form Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience our completely redesigned form builder with the new multi-date picker, 
            improved UX/UI, and powerful customization options.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowBuilder(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Zap className="h-5 w-5 mr-2" />
            Try Form Builder Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Multi-Date Picker</CardTitle>
              <CardDescription>
                Select multiple dates at once with our intuitive calendar interface. 
                Perfect for booking forms, event registration, and scheduling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Visual calendar interface</li>
                <li>• Quick date selection (Today, Tomorrow, Next Week)</li>
                <li>• Date input with validation</li>
                <li>• Selected date badges with remove option</li>
                <li>• Clear all functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Enhanced UX/UI</CardTitle>
              <CardDescription>
                Completely redesigned interface with gradient backgrounds, 
                smooth animations, and intuitive interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Color-coded field types</li>
                <li>• Hover effects and micro-interactions</li>
                <li>• Improved visual hierarchy</li>
                <li>• Better spacing and typography</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Complete User Journey</CardTitle>
              <CardDescription>
                Full user journey testing with form submission, thank you page preview, 
                and real-time submission data viewing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Visual journey progress indicator</li>
                <li>• Form → Submitting → Thank You steps</li>
                <li>• Custom thank you message preview</li>
                <li>• Redirect URL simulation</li>
                <li>• Restart journey functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Enhanced Scrolling</CardTitle>
              <CardDescription>
                Improved scrolling behavior with scroll indicators and independent panel scrolling. 
                Better UX with visual scroll hints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Scroll indicators in all panels</li>
                <li>• Independent panel scrolling</li>
                <li>• Fixed header and navigation</li>
                <li>• Better overflow handling</li>
                <li>• Smooth scroll experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">PDF Upload Feature</CardTitle>
              <CardDescription>
                Direct PDF template upload in PDF settings. 
                Upload custom PDF templates for form generation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Drag & drop PDF upload</li>
                <li>• File validation (PDF only)</li>
                <li>• Size limit (10MB max)</li>
                <li>• Visual upload interface</li>
                <li>• Template management</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Click the button below to launch the enhanced form builder and try all the new features.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                size="lg" 
                onClick={() => setShowBuilder(true)}
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Launch Form Builder
              </Button>
              {savedForm && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✨ Form successfully saved with {savedForm.fields?.length || 0} fields!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}