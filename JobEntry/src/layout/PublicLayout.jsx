import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { Footer } from './Footer';

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
