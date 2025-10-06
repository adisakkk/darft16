'use client';

import { useState } from 'react';
import { Calendar, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MultiDatePickerProps {
  placeholder?: string;
  value?: string[];
  onChange?: (dates: string[]) => void;
}

export default function MultiDatePicker({ placeholder = "Select dates", value = [], onChange }: MultiDatePickerProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(value);
  const [inputDate, setInputDate] = useState('');

  const addDate = () => {
    if (inputDate && !selectedDates.includes(inputDate)) {
      const newDates = [...selectedDates, inputDate];
      setSelectedDates(newDates);
      onChange?.(newDates);
      setInputDate('');
    }
  };

  const removeDate = (dateToRemove: string) => {
    const newDates = selectedDates.filter(date => date !== dateToRemove);
    setSelectedDates(newDates);
    onChange?.(newDates);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDate();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>
        <Button 
          type="button"
          onClick={addDate}
          disabled={!inputDate}
          size="sm"
          className="px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {selectedDates.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Dates:</p>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((date, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1 pr-1"
              >
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
      
      {selectedDates.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              No dates selected. Add dates using the date picker above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}