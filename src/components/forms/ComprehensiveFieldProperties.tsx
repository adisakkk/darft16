'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Hash,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Settings,
  Code,
  Zap,
  Target,
  Shield,
  CreditCard,
  Calculator,
  Star,
  Heart,
  ThumbsUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
  dates?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    customMessage?: string;
  };
  styling?: {
    width?: 'full' | 'half' | 'third' | 'quarter';
    height?: 'sm' | 'md' | 'lg';
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    padding?: string;
    margin?: string;
  };
  conditional?: {
    showWhen?: string;
    operator?: 'equals' | 'not_equals' | 'contains' | 'empty' | 'not_empty' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with';
    value?: string;
    logic?: 'and' | 'or';
  };
  advanced?: {
    autocomplete?: 'on' | 'off';
    spellcheck?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    className?: string;
    customId?: string;
    customAttributes?: Record<string, string>;
  };
  payment?: {
    type?: 'fixed' | 'variable';
    amount?: number;
    currency?: string;
    paymentProcessor?: 'stripe' | 'paypal' | 'square';
  };
}

interface ComprehensiveFieldPropertiesProps {
  field: FormField;
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (fieldId: string) => void;
  allFields: FormField[];
}

export default function ComprehensiveFieldProperties({ 
  field, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  allFields 
}: ComprehensiveFieldPropertiesProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
    onUpdate(field.id, { options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate(field.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index);
    onUpdate(field.id, { options: newOptions });
  };

  const updateValidation = (key: string, value: any) => {
    onUpdate(field.id, {
      validation: { ...field.validation, [key]: value }
    });
  };

  const updateStyling = (key: string, value: any) => {
    onUpdate(field.id, {
      styling: { ...field.styling, [key]: value }
    });
  };

  const updateConditional = (key: string, value: any) => {
    onUpdate(field.id, {
      conditional: { ...field.conditional, [key]: value }
    });
  };

  const updateAdvanced = (key: string, value: any) => {
    onUpdate(field.id, {
      advanced: { ...field.advanced, [key]: value }
    });
  };

  const fieldTypesWithOptions = ['dropdown', 'radio', 'checkbox', 'multiselect'];
  const fieldTypesWithValidation = ['text', 'textarea', 'number', 'email', 'phone', 'url', 'password'];
  const numericFieldTypes = ['number', 'rating', 'scale'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Field Properties</h3>
              <p className="text-xs text-gray-500">{field.type} field</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onDuplicate(field.id)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(field.id)} className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4 pb-2 border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="validation" className="text-xs">Validation</TabsTrigger>
            <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
            <TabsTrigger value="conditional" className="text-xs">Logic</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Basic Properties */}
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="field-label" className="text-sm font-medium">Field Label</Label>
                  <Input
                    id="field-label"
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                    className="mt-1"
                    placeholder="Enter field label"
                  />
                </div>

                <div>
                  <Label htmlFor="field-name" className="text-sm font-medium">Field Name</Label>
                  <Input
                    id="field-name"
                    value={field.name}
                    onChange={(e) => onUpdate(field.id, { name: e.target.value })}
                    className="mt-1"
                    placeholder="field_name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for form submission and references</p>
                </div>

                <div>
                  <Label htmlFor="field-placeholder" className="text-sm font-medium">Placeholder</Label>
                  <Input
                    id="field-placeholder"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="mt-1"
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div>
                  <Label htmlFor="field-description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="field-description"
                    value={field.description || ''}
                    onChange={(e) => onUpdate(field.id, { description: e.target.value })}
                    rows={2}
                    className="mt-1"
                    placeholder="Enter field description"
                  />
                  <p className="text-xs text-gray-500 mt-1">Help text shown below the field</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="field-required"
                    checked={field.required}
                    onCheckedChange={(checked) => onUpdate(field.id, { required: checked })}
                  />
                  <Label htmlFor="field-required" className="text-sm font-medium">
                    Required Field
                  </Label>
                </div>

                {/* Options for select/radio/checkbox fields */}
                {fieldTypesWithOptions.includes(field.type) && (
                  <div>
                    <Label className="text-sm font-medium">Options</Label>
                    <div className="mt-2 space-y-2">
                      {field.options?.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="text-sm"
                            placeholder={`Option ${index + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                        className="w-full text-sm"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}

                {/* Default Value */}
                <div>
                  <Label htmlFor="field-default" className="text-sm font-medium">Default Value</Label>
                  <Input
                    id="field-default"
                    value={(field as any).defaultValue || ''}
                    onChange={(e) => onUpdate(field.id, { defaultValue: e.target.value } as any)}
                    className="mt-1"
                    placeholder="Enter default value"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Validation Properties */}
            <TabsContent value="validation" className="space-y-4 mt-0">
              {fieldTypesWithValidation.includes(field.type) && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Character Limits</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label htmlFor="min-length" className="text-xs text-gray-600">Min Length</Label>
                        <Input
                          id="min-length"
                          type="number"
                          value={field.validation?.minLength || ''}
                          onChange={(e) => updateValidation('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-length" className="text-xs text-gray-600">Max Length</Label>
                        <Input
                          id="max-length"
                          type="number"
                          value={field.validation?.maxLength || ''}
                          onChange={(e) => updateValidation('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                          className="mt-1"
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="field-pattern" className="text-sm font-medium">Pattern (Regex)</Label>
                    <Input
                      id="field-pattern"
                      value={field.validation?.pattern || ''}
                      onChange={(e) => updateValidation('pattern', e.target.value)}
                      className="mt-1"
                      placeholder="^[A-Za-z0-9]+$"
                    />
                    <p className="text-xs text-gray-500 mt-1">Regular expression pattern</p>
                  </div>
                </>
              )}

              {numericFieldTypes.includes(field.type) && (
                <div>
                  <Label className="text-sm font-medium">Numeric Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label htmlFor="min-value" className="text-xs text-gray-600">Min Value</Label>
                      <Input
                        id="min-value"
                        type="number"
                        value={field.validation?.min || ''}
                        onChange={(e) => updateValidation('min', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-value" className="text-xs text-gray-600">Max Value</Label>
                      <Input
                        id="max-value"
                        type="number"
                        value={field.validation?.max || ''}
                        onChange={(e) => updateValidation('max', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="mt-1"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="custom-message" className="text-sm font-medium">Custom Error Message</Label>
                <Textarea
                  id="custom-message"
                  value={field.validation?.customMessage || ''}
                  onChange={(e) => updateValidation('customMessage', e.target.value)}
                  rows={2}
                  className="mt-1"
                  placeholder="Enter custom validation error message"
                />
              </div>
            </TabsContent>

            {/* Style Properties */}
            <TabsContent value="style" className="space-y-4 mt-0">
              <div>
                <Label className="text-sm font-medium">Layout</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="field-width" className="text-xs text-gray-600">Width</Label>
                    <Select
                      value={field.styling?.width || 'full'}
                      onValueChange={(value: 'full' | 'half' | 'third' | 'quarter') => updateStyling('width', value)}
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
                    <Label htmlFor="field-height" className="text-xs text-gray-600">Height</Label>
                    <Select
                      value={field.styling?.height || 'md'}
                      onValueChange={(value: 'sm' | 'md' | 'lg') => updateStyling('height', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Typography</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="font-size" className="text-xs text-gray-600">Font Size</Label>
                    <Select
                      value={field.styling?.fontSize || 'md'}
                      onValueChange={(value: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') => updateStyling('fontSize', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">Extra Small</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                        <SelectItem value="2xl">2X Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="font-weight" className="text-xs text-gray-600">Font Weight</Label>
                    <Select
                      value={field.styling?.fontWeight || 'normal'}
                      onValueChange={(value: 'light' | 'normal' | 'medium' | 'semibold' | 'bold') => updateStyling('fontWeight', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="semibold">Semibold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Text Alignment</Label>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant={field.styling?.textAlign === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStyling('textAlign', 'left')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={field.styling?.textAlign === 'center' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStyling('textAlign', 'center')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={field.styling?.textAlign === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateStyling('textAlign', 'right')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Border Radius</Label>
                <Select
                  value={field.styling?.borderRadius || 'md'}
                  onValueChange={(value: 'none' | 'sm' | 'md' | 'lg' | 'full') => updateStyling('borderRadius', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Colors</Label>
                <div className="space-y-2 mt-2">
                  <div>
                    <Label htmlFor="text-color" className="text-xs text-gray-600">Text Color</Label>
                    <Input
                      id="text-color"
                      type="color"
                      value={field.styling?.color || '#000000'}
                      onChange={(e) => updateStyling('color', e.target.value)}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg-color" className="text-xs text-gray-600">Background Color</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={field.styling?.backgroundColor || '#ffffff'}
                      onChange={(e) => updateStyling('backgroundColor', e.target.value)}
                      className="mt-1 h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="border-color" className="text-xs text-gray-600">Border Color</Label>
                    <Input
                      id="border-color"
                      type="color"
                      value={field.styling?.borderColor || '#d1d5db'}
                      onChange={(e) => updateStyling('borderColor', e.target.value)}
                      className="mt-1 h-8"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Conditional Logic */}
            <TabsContent value="conditional" className="space-y-4 mt-0">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-conditional"
                  checked={!!field.conditional?.showWhen}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateConditional('showWhen', '');
                      updateConditional('operator', 'equals');
                    } else {
                      onUpdate(field.id, { conditional: undefined });
                    }
                  }}
                />
                <Label htmlFor="enable-conditional" className="text-sm font-medium">
                  Enable Conditional Logic
                </Label>
              </div>

              {field.conditional?.showWhen && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="conditional-field" className="text-sm font-medium">Show this field when</Label>
                    <Select
                      value={field.conditional.showWhen}
                      onValueChange={(value) => updateConditional('showWhen', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a field" />
                      </SelectTrigger>
                      <SelectContent>
                        {allFields.filter(f => f.id !== field.id).map((f) => (
                          <SelectItem key={f.id} value={f.name}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="conditional-operator" className="text-sm font-medium">Condition</Label>
                    <Select
                      value={field.conditional.operator || 'equals'}
                      onValueChange={(value: any) => updateConditional('operator', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="starts_with">Starts with</SelectItem>
                        <SelectItem value="ends_with">Ends with</SelectItem>
                        <SelectItem value="empty">Is empty</SelectItem>
                        <SelectItem value="not_empty">Is not empty</SelectItem>
                        <SelectItem value="greater_than">Greater than</SelectItem>
                        <SelectItem value="less_than">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!['empty', 'not_empty'].includes(field.conditional.operator || '') && (
                    <div>
                      <Label htmlFor="conditional-value" className="text-sm font-medium">Value</Label>
                      <Input
                        id="conditional-value"
                        value={field.conditional.value || ''}
                        onChange={(e) => updateConditional('value', e.target.value)}
                        className="mt-1"
                        placeholder="Enter value"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Advanced Properties */}
            <TabsContent value="advanced" className="space-y-4 mt-0">
              <div>
                <Label className="text-sm font-medium">Field Status</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-readonly"
                      checked={field.advanced?.readonly || false}
                      onCheckedChange={(checked) => updateAdvanced('readonly', checked)}
                    />
                    <Label htmlFor="field-readonly" className="text-sm">Read-only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-disabled"
                      checked={field.advanced?.disabled || false}
                      onCheckedChange={(checked) => updateAdvanced('disabled', checked)}
                    />
                    <Label htmlFor="field-disabled" className="text-sm">Disabled</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-hidden"
                      checked={field.advanced?.hidden || false}
                      onCheckedChange={(checked) => updateAdvanced('hidden', checked)}
                    />
                    <Label htmlFor="field-hidden" className="text-sm">Hidden</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Input Behavior</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-autocomplete"
                      checked={field.advanced?.autocomplete !== 'off'}
                      onCheckedChange={(checked) => updateAdvanced('autocomplete', checked ? 'on' : 'off')}
                    />
                    <Label htmlFor="field-autocomplete" className="text-sm">Autocomplete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="field-spellcheck"
                      checked={field.advanced?.spellcheck !== false}
                      onCheckedChange={(checked) => updateAdvanced('spellcheck', checked)}
                    />
                    <Label htmlFor="field-spellcheck" className="text-sm">Spell Check</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="field-id" className="text-sm font-medium">Custom ID</Label>
                <Input
                  id="field-id"
                  value={field.advanced?.customId || ''}
                  onChange={(e) => updateAdvanced('customId', e.target.value)}
                  className="mt-1"
                  placeholder="custom-field-id"
                />
              </div>

              <div>
                <Label htmlFor="field-class" className="text-sm font-medium">CSS Classes</Label>
                <Input
                  id="field-class"
                  value={field.advanced?.className || ''}
                  onChange={(e) => updateAdvanced('className', e.target.value)}
                  className="mt-1"
                  placeholder="custom-class another-class"
                />
              </div>

              <div>
                <Label htmlFor="field-data" className="text-sm font-medium">Data Attributes</Label>
                <Textarea
                  id="field-data"
                  value={field.advanced?.customAttributes ? JSON.stringify(field.advanced.customAttributes, null, 2) : ''}
                  onChange={(e) => {
                    try {
                      const attrs = e.target.value ? JSON.parse(e.target.value) : {};
                      updateAdvanced('customAttributes', attrs);
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={3}
                  className="mt-1 font-mono text-xs"
                  placeholder='{"data-testid": "my-field", "data-category": "personal"}'
                />
                <p className="text-xs text-gray-500 mt-1">JSON format for custom data attributes</p>
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}