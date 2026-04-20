import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main
        className="pt-6 px-4 md:px-6 md:pt-24"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-3xl mx-auto space-y-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
