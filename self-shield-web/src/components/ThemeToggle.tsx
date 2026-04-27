'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-24 bg-muted/20 rounded-full animate-pulse" />;

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <div className="relative flex items-center p-1 bg-muted/20 rounded-full border border-border/50 backdrop-blur-sm">
      {/* Sliding Highlight */}
      <div 
        className={cn(
          "absolute h-7 w-7 bg-background rounded-full shadow-sm transition-all duration-300 ease-out z-0",
          theme === 'light' ? "left-1" : 
          theme === 'system' ? "left-1/2 -translate-x-1/2" : 
          "left-[calc(100%-1.75rem-0.25rem)]"
        )}
      />

      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={cn(
            "relative z-10 flex items-center justify-center h-7 w-7 rounded-full transition-colors duration-200",
            theme === opt.value ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          title={opt.label}
        >
          <opt.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
