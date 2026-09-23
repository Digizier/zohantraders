import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Dedicated Isolated Admin Container - Zero public header or footer */}
      {children}
    </div>
  );
}
