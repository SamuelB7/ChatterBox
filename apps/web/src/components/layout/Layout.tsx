/**
 * Layout Component
 * Main application layout wrapper
 */

import type { ReactNode } from 'react';
import { Header } from './Header';

export interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

export default Layout;
