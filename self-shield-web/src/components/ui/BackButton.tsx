'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="group flex items-center gap-1 text-muted-foreground hover:text-primary transition-all duration-300 -ml-2 pr-4 pl-2 rounded-full hover:bg-primary/5 active:scale-95"
    >
      <div className="p-1 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
        <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
      <span className="text-xs font-semibold tracking-wide">Back</span>
    </Button>
  );
}
