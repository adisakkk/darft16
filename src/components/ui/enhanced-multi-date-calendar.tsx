'use client';

import { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Check,
  CalendarDays,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedMultiDateCalendarProps {
  placeholder?: string;
  value?: string[];
  onChange?: (dates: string[]) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export default function EnhancedMultiDateCalendar({ 
  placeholder = "Select multiple dates", 
  value = [], 
  onChange,
  className 
}: EnhancedMultiDateCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    value.map(dateStr => new Date(dateStr + 'T00:00:00'))
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getPreviousMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    
    const days: Date[] = [];
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, daysInPrevMonth - i));
    }
    
    return days;
  };

  const getNextMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (startDay + daysInMonth);
    
    const days: Date[] = [];
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const calendarDays = useMemo((): CalendarDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const prevDays = getPreviousMonthDays(currentDate);
    const currentDays = getDaysInMonth(currentDate);
    const nextDays = getNextMonthDays(currentDate);
    
    const allDays = [...prevDays, ...currentDays, ...nextDays];
    
    return allDays.map(date => {
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      
      return {
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isSelected: selectedDates.some(selectedDate => {
          const selectedOnly = new Date(selectedDate);
          selectedOnly.setHours(0, 0, 0, 0);
          return selectedOnly.getTime() === dateOnly.getTime();
        }),
        isToday: dateOnly.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      };
    });
  }, [currentDate, selectedDates]);

  const handleDateClick = (date: Date) => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    const existingIndex = selectedDates.findIndex(selectedDate => {
      const selectedOnly = new Date(selectedDate);
      selectedOnly.setHours(0, 0, 0, 0);
      return selectedOnly.getTime() === dateOnly.getTime();
    });

    let newSelectedDates: Date[];
    
    if (existingIndex > -1) {
      // Remove date if already selected
      newSelectedDates = selectedDates.filter((_, index) => index !== existingIndex);
    } else {
      // Add date if not selected
      newSelectedDates = [...selectedDates, dateOnly];
    }

    // Sort dates
    newSelectedDates.sort((a, b) => a.getTime() - b.getTime());
    
    setSelectedDates(newSelectedDates);
    
    // Convert to string format for onChange
    const dateStringArray = newSelectedDates.map(date => 
      date.toISOString().split('T')[0]
    );
    onChange?.(dateStringArray);
  };

  const removeDate = (dateToRemove: string) => {
    const newSelectedDates = selectedDates.filter(date => {
      const dateStr = date.toISOString().split('T')[0];
      return dateStr !== dateToRemove;
    });
    
    setSelectedDates(newSelectedDates);
    
    const dateStringArray = newSelectedDates.map(date => 
      date.toISOString().split('T')[0]
    );
    onChange?.(dateStringArray);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearAllDates = () => {
    setSelectedDates([]);
    onChange?.([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Calendar Trigger */}
      <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedDates.length > 0 
                    ? `${selectedDates.length} date${selectedDates.length !== 1 ? 's' : ''} selected`
                    : placeholder
                  }
                </p>
                {selectedDates.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {selectedDates.length === 1 
                      ? formatDate(selectedDates[0])
                      : `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[selectedDates.length - 1])}`
                    }
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              isCalendarOpen && "rotate-90"
            )} />
          </div>
        </CardContent>
      </Card>

      {/* Selected Dates Display */}
      {selectedDates.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Selected Dates</h4>
              <Button variant="ghost" size="sm" onClick={clearAllDates}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                return (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    <CalendarIcon className="h-3 w-3" />
                    {formatDate(date)}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDate(dateStr);
                      }}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      {isCalendarOpen && (
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={cn(
                    "relative h-10 w-10 rounded-lg text-sm font-medium transition-all",
                    "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    {
                      "text-gray-900": day.isCurrentMonth,
                      "text-gray-400": !day.isCurrentMonth,
                      "bg-blue-600 text-white hover:bg-blue-700": day.isSelected,
                      "bg-blue-50 text-blue-600 hover:bg-blue-100": day.isToday && !day.isSelected,
                      "text-red-500": day.isWeekend && !day.isSelected && day.isCurrentMonth,
                      "text-red-300": day.isWeekend && !day.isSelected && !day.isCurrentMonth,
                    }
                  )}
                >
                  <span className="flex items-center justify-center h-full">
                    {day.date.getDate()}
                  </span>
                  {day.isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {day.isToday && !day.isSelected && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Click dates to select or deselect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-xs text-gray-600">Selected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                    <span className="text-xs text-gray-600">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}