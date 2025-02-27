import { Main } from '@/app/(home)/main';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Main />
    </div>
  );
}
