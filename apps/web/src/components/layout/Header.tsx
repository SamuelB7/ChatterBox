/**
 * Header Component
 * Application header with title
 */

import { MessageSquare } from 'lucide-react';

export function Header() {
  const appName = import.meta.env.VITE_APP_NAME || 'ChatterBox 2.0';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center">
        <MessageSquare className="w-6 h-6 text-primary-600 mr-3" />
        <h1 className="text-xl font-bold text-gray-900">{appName}</h1>
        <span className="ml-3 px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
          POC
        </span>
      </div>
    </header>
  );
}

export default Header;
