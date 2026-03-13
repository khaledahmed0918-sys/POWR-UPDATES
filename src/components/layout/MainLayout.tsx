import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative w-full items-center">
      <main className="flex-1 w-full pb-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
