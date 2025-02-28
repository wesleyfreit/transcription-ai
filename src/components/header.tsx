'use client';

import Logo from '@/assets/logo.svg';
import { Button } from './ui/button';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => {
  return (
    <header
      className="flex items-center justify-between border-b px-6 py-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-center gap-2">
        <Image src={Logo} alt="" height={40} width={40} />
        <h1 className="text-xl font-bold">TranscriptionAi</h1>
      </div>

      <Button
        variant="ghost"
        className="bg-blue-900 hover:bg-blue-900/80 focus-visible:ring-foreground"
        asChild
      >
        <Link href="https://www.linkedin.com/in/wesleyfreit/">
          <Linkedin className="size-4" />
          LinkedIn
        </Link>
      </Button>
    </header>
  );
};
