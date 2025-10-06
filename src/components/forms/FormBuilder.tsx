'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MultiDatePicker from '@/components/ui/multi-date-picker';
import EnhancedMultiDateCalendar from '@/components/ui/enhanced-multi-date-calendar';
import '@/styles/form-builder.css';
import { 
  Type,
  Text,
  SquareCheck,
  List,
  CalendarDays,
  Mail,
  Phone,
  Hash,
  MessageSquare,
  RadioIcon,
  ChevronDown,
  GripVertical,
  Settings,
  Save,
  File,
  Download,
  Copy,
  Trash2,
  Plus,
  ArrowLeft,
  Eye,
  ExternalLink,
  Blocks,
  Table2,
  Image,
  FileText,
  Heading1,
  Heading2,
  Divider,
  Clock,
  MapPin,
  Link2,
  Star,
  Heart,
  ThumbsUp,
  Scale,
  Calculator,
  Signature,
  Camera,
  Video,
  Mic,
  Upload,
  Users,
  Shield,
  CreditCard,
  ShoppingCart,
  Package,
  DollarSign,
  Percent,
  Tag,
  Barcode,
  QrCode,
  Zap,
  Target,
  Layers,
  Grid3X3,
  Maximize2,
  Minimize2,
  MoreVertical,
  Search,
  Filter,
  SlidersHorizontal,
  Palette,
  Font,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  ListTodo,
  Indent,
  Outdent,
  Undo2,
  Redo2,
  Lock,
  Unlock,
  EyeOff,
  Edit3,
  Check,
  X,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Code,
  PenTool
} from 'lucide-react';
import { useTemplates } from '@/hooks/use-templates';
import { useForms } from '@/hooks/use-forms';

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
  dates?: string[]; // For multi-date picker
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  styling?: {
    width?: 'full' | 'half' | 'third' | 'quarter';
    color?: string;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg';
    fontSize?: 'sm' | 'md' | 'lg' | 'xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
  };
  conditional?: {
    showWhen?: string;
    operator?: 'equals' | 'not_equals' | 'contains' | 'empty' | 'not_empty' | 'greater_than' | 'less_than';
    value?: string;
  };
  payment?: {
    type?: 'fixed' | 'variable';
    amount?: number;
    currency?: string;
  };
}

interface FormBuilderProps {
  onSave: (form: { 
    name: string; 
    description: string; 
    fields: FormField[];
    enablePdfGeneration: boolean;
    linkedTemplateId?: string;
    autoGeneratePdf: boolean;
    autoEmailPdf: boolean;
    showPdfDownload: boolean;
    thankYouMessage: string;
    enableRedirect: boolean;
    redirectUrl?: string;
  }) => void;
  initialForm?: any;
  previewMode?: boolean;
}

const fieldCategories = [
  {
    name: 'Basic',
    icon: FileText,
    fields: [
      { type: 'text', label: 'Short Text', icon: Type, description: 'Single-line text input for names, titles, and short responses' },
      { type: 'textarea', label: 'Paragraph', icon: Text, description: 'Multi-line text area for detailed responses and comments' },
      { type: 'number', label: 'Number', icon: Hash, description: 'Numeric input for quantities, ages, and measurements' },
      { type: 'email', label: 'Email', icon: Mail, description: 'Email address field with automatic validation' },
      { type: 'phone', label: 'Phone', icon: Phone, description: 'Phone number input with format validation' },
      { type: 'url', label: 'Website', icon: Link2, description: 'URL input for website and social media links' },
      { type: 'heading', label: 'Heading', icon: Heading1, description: 'Section titles and form headers for organization' },
    ]
  },
  {
    name: 'Choice',
    icon: SquareCheck,
    fields: [
      { type: 'dropdown', label: 'Dropdown', icon: List, description: 'Single selection from a dropdown menu' },
      { type: 'radio', label: 'Radio', icon: RadioIcon, description: 'Single selection from radio button options' },
      { type: 'checkbox', label: 'Checkbox', icon: SquareCheck, description: 'Multiple checkbox selections for yes/no options' },
      { type: 'yes-no', label: 'Yes/No', icon: Check, description: 'Binary choice between Yes and No' },
      { type: 'rating', label: 'Rating', icon: Star, description: 'Star rating scale for feedback and reviews' },
      { type: 'scale', label: 'Scale', icon: Scale, description: 'Numeric scale for satisfaction and preference ratings' },
    ]
  },
  {
    name: 'Date & Time',
    icon: CalendarDays,
    fields: [
      { type: 'date', label: 'Date', icon: CalendarDays, description: 'Date picker for birthdays, appointments, and events' },
      { type: 'time', label: 'Time', icon: Clock, description: 'Time picker for scheduling and time slots' },
      { type: 'datetime', label: 'Date Time', icon: CalendarDays, description: 'Combined date and time picker for complete scheduling' },
      { type: 'month', label: 'Month', icon: CalendarDays, description: 'Month selector for seasonal and yearly planning' },
      { type: 'year', label: 'Year', icon: CalendarDays, description: 'Year input for historical and future dates' },
      { type: 'multidate', label: 'Multi-Date Calendar', icon: CalendarDays, description: 'Beautiful calendar interface for selecting multiple dates with one click' },
    ]
  },
  {
    name: 'Address',
    icon: MapPin,
    fields: [
      { type: 'address', label: 'Address', icon: MapPin, description: 'Complete address input with street, city, state, and zip code' },
      { type: 'country', label: 'Country', icon: MapPin, description: 'Country selection from comprehensive list' },
      { type: 'state', label: 'State', icon: MapPin, description: 'State or province selection dropdown' },
      { type: 'city', label: 'City', icon: MapPin, description: 'City input field for location-based forms' },
      { type: 'zip', label: 'Zip Code', icon: MapPin, description: 'Postal code input with format validation' },
    ]
  },
  {
    name: 'File',
    icon: Upload,
    fields: [
      { type: 'file', label: 'File Upload', icon: Upload, description: 'File attachment upload for documents and media' },
      { type: 'image', label: 'Image', icon: Image, description: 'Image upload for photos and graphics with preview' },
      { type: 'signature', label: 'Signature', icon: Signature, description: 'Digital signature pad for electronic signatures' },
      { type: 'camera', label: 'Camera', icon: Camera, description: 'Take photo using device camera' },
    ]
  },
  {
    name: 'Advanced',
    icon: Settings,
    fields: [
      { type: 'hidden', label: 'Hidden', icon: EyeOff, description: 'Invisible field for storing data and tracking' },
      { type: 'password', label: 'Password', icon: Lock, description: 'Secure password input with masking' },
      { type: 'calculation', label: 'Calculation', icon: Calculator, description: 'Automatic calculations based on other field values' },
      { type: 'widget', label: 'Widget', icon: Zap, description: 'Custom widget for specialized functionality' },
      { type: 'html', label: 'HTML', icon: Code, description: 'Custom HTML content for advanced formatting' },
      { type: 'divider', label: 'Divider', icon: Divider, description: 'Visual separator between form sections' },
    ]
  }
];

export default function FormBuilder({ onSave, initialForm, previewMode = false }: FormBuilderProps) {
  const { templates, uploadTemplate } = useTemplates();
  const { updateForm } = useForms();
  
  const [formName, setFormName] = useState(initialForm?.name || 'Untitled Form');
  const [formDescription, setFormDescription] = useState(initialForm?.description || '');
  const [fields, setFields] = useState<FormField[]>(initialForm?.fields || []);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Basic');
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [showFormSettings, setShowFormSettings] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(previewMode);
  
  // Form Settings
  const [enablePdfGeneration, setEnablePdfGeneration] = useState(initialForm?.enablePdfGeneration || false);
  const [linkedTemplateId, setLinkedTemplateId] = useState(initialForm?.linkedTemplateId || '');
  const [autoGeneratePdf, setAutoGeneratePdf] = useState(initialForm?.autoGeneratePdf ?? true);
  const [autoEmailPdf, setAutoEmailPdf] = useState(initialForm?.autoEmailPdf || false);
  const [showPdfDownload, setShowPdfDownload] = useState(initialForm?.showPdfDownload ?? true);
  const [thankYouMessage, setThankYouMessage] = useState(initialForm?.thankYouMessage || 'Thanks for completing the form! We\'ll be in touch shortly.');
  const [enableRedirect, setEnableRedirect] = useState(initialForm?.enableRedirect || false);
  const [redirectUrl, setRedirectUrl] = useState(initialForm?.redirectUrl || '');

  const addField = (type: string) => {
    const category = fieldCategories.find(cat => cat.fields.some(field => field.type === type));
    const fieldType = category?.fields.find(field => field.type === type);
    
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${fieldType?.label || 'Field'}`,
      name: `field_${Date.now()}`,
      required: false,
      placeholder: '',
      description: '',
      options: type === 'dropdown' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
      dates: type === 'multidate' ? [] : undefined,
      validation: {},
      styling: {
        width: 'full',
        borderRadius: 'md',
        fontSize: 'md',
        fontWeight: 'normal',
        textAlign: 'left',
      },
      conditional: undefined,
    };
    setFields([...fields, newField]);
    setSelectedField(newField.id);
    setShowFieldSettings(true);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
    if (selectedField === fieldId) {
      setSelectedField(null);
      setShowFieldSettings(false);
    }
  };

  const duplicateField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const newField = {
        ...field,
        id: Date.now().toString(),
        name: `${field.name}_copy`,
        label: `${field.label} (Copy)`,
      };
      setFields([...fields, newField]);
      setSelectedField(newField.id);
    }
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const draggedFieldItem = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedFieldItem);
    setFields(newFields);
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedField) {
      const dragIndex = fields.findIndex(f => f.id === draggedField);
      if (dragIndex !== dropIndex) {
        moveField(dragIndex, dropIndex);
      }
    }
    setDraggedField(null);
    setIsDraggingOver(false);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('Please enter a form name');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    setIsSaving(true);
    try {
      const formData = {
        name: formName,
        description: formDescription,
        fields,
        enablePdfGeneration,
        linkedTemplateId: enablePdfGeneration ? linkedTemplateId : null,
        autoGeneratePdf,
        autoEmailPdf,
        showPdfDownload,
        thankYouMessage,
        enableRedirect,
        redirectUrl: enableRedirect ? redirectUrl : null,
      };

      if (initialForm?.id) {
        await updateForm(initialForm.id, formData);
      }
      
      onSave(formData);
    } catch (error) {
      console.error('Failed to save form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  const renderFieldPreview = (field: FormField) => {
    const baseProps = {
      placeholder: field.placeholder,
      value: field.placeholder, // Add value to show placeholder text
    };

    switch (field.type) {
      case 'textarea':
        return <Textarea {...baseProps} rows={3} />;
      case 'dropdown':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.name} value={option} />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" value={option} />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'heading':
        return <h3 className="text-lg font-semibold">{field.label}</h3>;
      case 'subheading':
        return <h4 className="text-md font-medium">{field.label}</h4>;
      case 'divider':
        return <hr className="my-4" />;
      case 'date':
        return <Input type="date" {...baseProps} />;
      case 'time':
        return <Input type="time" {...baseProps} />;
      case 'datetime':
        return <Input type="datetime-local" {...baseProps} />;
      case 'month':
        return <Input type="month" {...baseProps} />;
      case 'year':
        return <Input type="number" {...baseProps} placeholder="YYYY" min="1900" max="2100" />;
      case 'multidate':
        return <EnhancedMultiDateCalendar {...baseProps} value={field.dates} onChange={(dates) => updateField(field.id, { dates })} />;
      case 'number':
        return <Input type="number" {...baseProps} />;
      case 'email':
        return <Input type="email" {...baseProps} />;
      case 'phone':
        return <Input type="tel" {...baseProps} />;
      case 'url':
        return <Input type="url" {...baseProps} />;
      case 'password':
        return <Input type="password" {...baseProps} />;
      case 'file':
        return <Input type="file" {...baseProps} />;
      case 'image':
        return <Input type="file" accept="image/*" {...baseProps} />;
      case 'hidden':
        return <Input type="hidden" {...baseProps} />;
      case 'yes-no':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name={field.name} value="yes" />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name={field.name} value="no" />
              <span>No</span>
            </label>
          </div>
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-gray-300 hover:text-yellow-400 focus:outline-none focus:text-yellow-400"
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        );
      case 'scale':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((scale) => (
              <label key={scale} className="flex flex-col items-center">
                <input type="radio" name={field.name} value={scale} className="mb-1" />
                <span className="text-xs">{scale}</span>
              </label>
            ))}
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2">
            <Input placeholder="Street Address" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="City" />
              <Input placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="ZIP Code" />
              <Input placeholder="Country" />
            </div>
          </div>
        );
      case 'country':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="cn">China</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="br">Brazil</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'state':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">California</SelectItem>
              <SelectItem value="tx">Texas</SelectItem>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="fl">Florida</SelectItem>
              <SelectItem value="il">Illinois</SelectItem>
              <SelectItem value="pa">Pennsylvania</SelectItem>
              <SelectItem value="oh">Ohio</SelectItem>
              <SelectItem value="ga">Georgia</SelectItem>
              <SelectItem value="nc">North Carolina</SelectItem>
              <SelectItem value="mi">Michigan</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'city':
        return <Input placeholder="Enter city name" {...baseProps} />;
      case 'zip':
        return <Input placeholder="Enter ZIP code" {...baseProps} />;
      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Click to sign</p>
            <div className="h-20 bg-gray-50 rounded flex items-center justify-center">
              <PenTool className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        );
      case 'camera':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Click to take photo</p>
            <div className="h-20 bg-gray-50 rounded flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        );
      case 'calculation':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Calculated value will appear here</p>
            <p className="text-lg font-semibold text-gray-900">0</p>
          </div>
        );
      case 'widget':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600">Custom Widget</p>
          </div>
        );
      case 'html':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">HTML content will be rendered here</p>
          </div>
        );
      default:
        return <Input type={field.type} {...baseProps} />;
    }
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{formName}</CardTitle>
                  {formDescription && <CardDescription>{formDescription}</CardDescription>}
                </div>
                <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Form
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-base font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderFieldPreview(field)}
                  {field.description && (
                    <p className="text-sm text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 w-auto"
              placeholder="Form Title"
            />
            <Badge variant="outline" className="text-xs">
              {fields.length} fields
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsPreviewMode(true)}
            disabled={fields.length === 0}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Field Types */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-24 bottom-0 z-10">
          {/* Header Section */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Form Elements</h3>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Category Tabs Section with Scroll */}
          <div className="border-b border-gray-200">
            <ScrollArea className="h-48 form-builder-scroll">
              <div className="p-4 space-y-1">
                {fieldCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === category.name
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Field List Section with Scroll */}
          <ScrollArea className="flex-1 form-builder-scroll">
            <div className="p-4 space-y-2">
              {fieldCategories
                .find(cat => cat.name === activeCategory)
                ?.fields.map((fieldType) => (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-gray-100 group-hover:bg-gray-200 transition-colors flex-shrink-0">
                        <fieldType.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900">{fieldType.label}</div>
                        <div className="text-xs text-gray-500 truncate">{fieldType.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Form Canvas */}
        <div className="flex-1 flex flex-col bg-gray-50 ml-80 mr-80" onClick={(e) => {
          // Close properties panel when clicking on empty canvas area
          if (e.target === e.currentTarget) {
            setShowFieldSettings(false);
          }
        }}>
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold text-gray-900">Form Canvas</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Layout
                </Button>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4 mr-2" />
                  Theme
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 form-builder-scroll">
            <div className="max-w-4xl mx-auto p-6">
              {fields.length === 0 ? (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Form</h3>
                  <p className="text-gray-600 mb-6">Drag fields from the left panel or click to add them to your form</p>
                  <div className="flex justify-center space-x-3">
                    <Button 
                      onClick={() => addField('text')}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Text Field
                    </Button>
                    <Button 
                      onClick={() => addField('email')}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email Field
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => {
                        handleDragStart(e, field.id);
                        e.dataTransfer.setData('text/plain', field.type);
                      }}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`bg-white rounded-lg border-2 p-4 cursor-move transition-all ${
                        selectedField === field.id 
                          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedField(field.id);
                        setShowFieldSettings(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="text-gray-400 cursor-move">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Label className="font-medium text-gray-900 truncate">
                                {field.label}
                              </Label>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            {field.description && (
                              <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateField(field.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteField(field.id)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pointer-events-none">
                        {renderFieldPreview(field)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Sidebar - Field Properties */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col fixed right-0 top-24 bottom-0 z-20 shadow-lg">
          {showFieldSettings && selectedFieldData ? (
            <>
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Field Properties</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFieldSettings(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 form-builder-scroll">
                <div className="p-4 space-y-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="style">Style</TabsTrigger>
                      <TabsTrigger value="rules">Rules</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4">
                      <div>
                        <Label htmlFor="field-label" className="text-sm font-medium">Field Label</Label>
                        <Input
                          id="field-label"
                          value={selectedFieldData.label}
                          onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="field-name" className="text-sm font-medium">Field Name</Label>
                        <Input
                          id="field-name"
                          value={selectedFieldData.name}
                          onChange={(e) => updateField(selectedFieldData.id, { name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="field-placeholder" className="text-sm font-medium">Placeholder</Label>
                        <Input
                          id="field-placeholder"
                          value={selectedFieldData.placeholder || ''}
                          onChange={(e) => updateField(selectedFieldData.id, { placeholder: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="field-description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="field-description"
                          value={selectedFieldData.description || ''}
                          onChange={(e) => updateField(selectedFieldData.id, { description: e.target.value })}
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="field-required"
                          checked={selectedFieldData.required}
                          onCheckedChange={(checked) => updateField(selectedFieldData.id, { required: checked })}
                        />
                        <Label htmlFor="field-required" className="text-sm font-medium">
                          Required
                        </Label>
                      </div>

                      {/* Options for select/radio/checkbox fields */}
                      {(selectedFieldData.type === 'dropdown' || selectedFieldData.type === 'radio' || selectedFieldData.type === 'checkbox') && (
                        <div>
                          <Label className="text-sm font-medium">Options</Label>
                          <div className="mt-2 space-y-2">
                            {selectedFieldData.options?.map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(selectedFieldData.options || [])];
                                    newOptions[index] = e.target.value;
                                    updateField(selectedFieldData.id, { options: newOptions });
                                  }}
                                  className="text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = selectedFieldData.options?.filter((_, i) => i !== index);
                                    updateField(selectedFieldData.id, { options: newOptions });
                                  }}
                                  className="h-8 w-8 p-0 text-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newOptions = [...(selectedFieldData.options || []), `Option ${(selectedFieldData.options?.length || 0) + 1}`];
                                updateField(selectedFieldData.id, { options: newOptions });
                              }}
                              className="w-full text-sm"
                            >
                              <Plus className="h-3 w-3 mr-2" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="style" className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Field Width</Label>
                        <Select
                          value={selectedFieldData.styling?.width || 'full'}
                          onValueChange={(value: 'full' | 'half' | 'third' | 'quarter') => 
                            updateField(selectedFieldData.id, {
                              styling: { ...selectedFieldData.styling, width: value }
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Width</SelectItem>
                            <SelectItem value="half">Half Width</SelectItem>
                            <SelectItem value="third">Third Width</SelectItem>
                            <SelectItem value="quarter">Quarter Width</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Font Size</Label>
                        <Select
                          value={selectedFieldData.styling?.fontSize || 'md'}
                          onValueChange={(value: 'sm' | 'md' | 'lg' | 'xl') => 
                            updateField(selectedFieldData.id, {
                              styling: { ...selectedFieldData.styling, fontSize: value }
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="xl">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Text Align</Label>
                        <Select
                          value={selectedFieldData.styling?.textAlign || 'left'}
                          onValueChange={(value: 'left' | 'center' | 'right') => 
                            updateField(selectedFieldData.id, {
                              styling: { ...selectedFieldData.styling, textAlign: value }
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="rules" className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Show this field if</Label>
                        <Select defaultValue="always">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Always show</SelectItem>
                            <SelectItem value="conditional">Show conditionally</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Field Properties</h3>
                <p className="text-sm text-gray-500">Select a field to edit its properties</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}