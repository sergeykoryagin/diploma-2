'use client';

import { useState } from 'react';
import RecommendationsHeader from '@/components/recommendations/recommendations-header';
import RecommendationsList from '@/components/recommendations/recommendations-list';
import AuthStatus from "@/components/auth-status/auth-status";

type ViewMode = 'list' | 'map';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-10 gap-8 font-[var(--font-geist-sans)]">
      <header className="flex justify-between items-center w-full max-w-[960px] pb-4 border-b border-black/[0.08] dark:border-white/[0.145]">
        <h1>Маршруты</h1>
        <AuthStatus />
      </header>
      <main className="container mx-auto px-4 py-8 w-full max-w-[960px]">
        <RecommendationsHeader viewMode={viewMode} setViewMode={setViewMode} />
        <RecommendationsList viewMode={viewMode} />
      </main>
    </div>
  );
}
