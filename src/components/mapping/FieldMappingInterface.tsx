'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Trash2, 
  FileText,
  File,
  Plus,
  Download
} from 'lucide-react';
import { useForms } from '@/hooks/use-forms';
import { useTemplates } from '@/hooks/use-templates';
import { mappingsApi, type FieldMapping } from '@/lib/api';

interface FieldMappingComponent {
  id: string;
  fieldName: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function FieldMappingInterface() {
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [mappings, setMappings] = useState<FieldMappingComponent[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const { forms } = useForms();
  const { templates } = useTemplates();

  const selectedForm = forms.find(f => f.id === selectedFormId);
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  // Load mappings when form and template are selected
  useEffect(() => {
    if (selectedFormId && selectedTemplateId) {
      loadMappings();
    }
  }, [selectedFormId, selectedTemplateId]);

  const loadMappings = async () => {
    try {
      const data = await mappingsApi.get(selectedFormId, selectedTemplateId);
      setMappings(data.map(mapping => ({
        id: mapping.id,
        fieldName: mapping.fieldName,
        x: mapping.x,
        y: mapping.y,
        width: mapping.width,
        height: mapping.height,
      })));
    } catch (error) {
      console.error('Failed to load mappings:', error);
    }
  };

  const handleFieldDragStart = (fieldName: string, event: React.DragEvent) => {
    event.dataTransfer.setData('fieldName', fieldName);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const fieldName = event.dataTransfer.getData('fieldName');
    
    if (!fieldName || !selectedFormId || !selectedTemplateId || !canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - 75; // Center the field
    const y = event.clientY - rect.top - 15;

    try {
      const newMapping = await mappingsApi.create({
        formId: selectedFormId,
        templateId: selectedTemplateId,
        fieldName,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: 150,
        height: 30,
      });

      setMappings(prev => [...prev, {
        id: newMapping.id,
        fieldName: newMapping.fieldName,
        x: newMapping.x,
        y: newMapping.y,
        width: newMapping.width,
        height: newMapping.height,
      }]);
    } catch (error) {
      console.error('Failed to create mapping:', error);
    }
  };

  const handleCanvasDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleMappingMouseDown = (mappingId: string, event: React.MouseEvent) => {
    const mapping = mappings.find(m => m.id === mappingId);
    if (!mapping || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left - mapping.x,
      y: event.clientY - rect.top - mapping.y,
    });
    setIsDragging(mappingId);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(event.clientX - rect.left - dragOffset.x, rect.width - 150));
    const newY = Math.max(0, Math.min(event.clientY - rect.top - dragOffset.y, rect.height - 30));

    setMappings(prev => prev.map(mapping => 
      mapping.id === isDragging 
        ? { ...mapping, x: newX, y: newY }
        : mapping
    ));
  };

  const handleMouseUp = async () => {
    if (isDragging) {
      const mapping = mappings.find(m => m.id === isDragging);
      if (mapping) {
        try {
          await mappingsApi.update(mapping.id, {
            x: mapping.x,
            y: mapping.y,
            width: mapping.width,
            height: mapping.height,
          });
        } catch (error) {
          console.error('Failed to update mapping:', error);
        }
      }
    }
    setIsDragging(null);
  };

  const handleDeleteMapping = async (mappingId: string) => {
    try {
      await mappingsApi.delete(mappingId);
      setMappings(prev => prev.filter(m => m.id !== mappingId));
    } catch (error) {
      console.error('Failed to delete mapping:', error);
    }
  };

  const handleResizeMapping = async (mappingId: string, width: number, height: number) => {
    setMappings(prev => prev.map(mapping => 
      mapping.id === mappingId 
        ? { ...mapping, width, height }
        : mapping
    ));

    try {
      await mappingsApi.update(mappingId, { width, height });
    } catch (error) {
      console.error('Failed to resize mapping:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping Setup</CardTitle>
          <CardDescription>Select a form and PDF template to start mapping fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Form</label>
              <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a form..." />
                </SelectTrigger>
                <SelectContent>
                  {forms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select PDF Template</label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {mappings.length} mapping{mappings.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedFormId && selectedTemplateId && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Form Fields Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Form Fields
              </CardTitle>
              <CardDescription>Drag fields onto the PDF canvas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedForm?.fields.map((field) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={(e) => handleFieldDragStart(field.name, e)}
                    className="p-3 bg-gray-50 border rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{field.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{field.name}</span>
                  </div>
                ))}
                {selectedForm?.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No fields in this form</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PDF Canvas */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                PDF Template Canvas
              </CardTitle>
              <CardDescription>
                {selectedTemplate?.name} - Drag form fields here to map them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={canvasRef}
                className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                style={{ height: '600px' }}
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* PDF Preview Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <File className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">PDF Template Preview</p>
                    <p className="text-sm">Drag form fields onto this canvas to map them</p>
                  </div>
                </div>

                {/* Field Mappings */}
                {mappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-50 rounded flex items-center justify-center cursor-move select-none group"
                    style={{
                      left: `${mapping.x}px`,
                      top: `${mapping.y}px`,
                      width: `${mapping.width}px`,
                      height: `${mapping.height}px`,
                    }}
                    onMouseDown={(e) => handleMappingMouseDown(mapping.id, e)}
                  >
                    <span className="text-xs font-medium text-blue-700 truncate px-1">
                      {mapping.fieldName}
                    </span>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMapping(mapping.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    {/* Resize Handle */}
                    <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}

                {/* Instructions Overlay */}
                {mappings.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white bg-opacity-90 p-6 rounded-lg text-center max-w-md">
                      <Map className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                      <h3 className="text-lg font-semibold mb-2">Start Mapping Fields</h3>
                      <p className="text-gray-600">
                        Drag form fields from the left panel onto this canvas to map them to specific locations on your PDF template.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mapping Instructions */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Drag form fields from the left panel onto the PDF canvas</li>
                  <li>• Click and drag mapped fields to reposition them</li>
                  <li>• Hover over a mapped field and click the × to delete it</li>
                  <li>• Fields will be positioned exactly where you place them on the generated PDF</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!selectedFormId || !selectedTemplateId && (
        <Card>
          <CardContent className="text-center py-12">
            <Map className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Select Form and Template
            </h3>
            <p className="text-gray-500">
              Choose both a form and PDF template to start mapping fields
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}