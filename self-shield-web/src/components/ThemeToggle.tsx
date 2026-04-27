'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="group relative h-9 w-9 rounded-full bg-muted/20 hover:bg-muted/40 transition-all duration-300 active:scale-90"
    >
      <div className="absolute inset-0 rounded-full border border-primary/20 scale-0 group-hover:scale-100 group-hover:opacity-100 opacity-0 transition-all duration-500 group-hover:rotate-180" />
      
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out group-hover:text-primary dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out group-hover:text-primary dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
