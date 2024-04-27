import { Linkedin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b">
      <h1 className="text-xl font-bold">TranscriptionAi</h1>
      <Button variant="outline" className="bg-blue-900 hover:bg-blue-900/80" asChild>
        <Link href="https://www.linkedin.com/in/wesleyfreit/">
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </Link>
      </Button>
    </header>
  );
};
