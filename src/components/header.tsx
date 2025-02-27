'use client';

import { Button } from '@/components/button';
import { Linkedin } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <h1 className="text-xl font-bold">TranscriptionAi</h1>
      <Button
        variant="ghost"
        className="bg-blue-900 hover:bg-blue-900/80 focus-visible:ring-foreground"
        asChild
      >
        <Link href="https://www.linkedin.com/in/wesleyfreit/">
          <Linkedin className="mr-2 size-4" />
          LinkedIn
        </Link>
      </Button>
    </header>
  );
};
