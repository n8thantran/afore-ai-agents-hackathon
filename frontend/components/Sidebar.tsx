'use client';

import { Home, FolderOpen, Settings, Activity, Users, CreditCard, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('overview');
  const { data: session } = useSession();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)]">
      <div className="p-4">
        {/* Team Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="User avatar" 
                className="w-8 h-8 rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {session?.user?.name ? getInitials(session.user.name) : 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personal Account</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </button>
        </div>

        {/* Usage Card */}
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Usage this month</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Bandwidth</span>
              <span className="text-gray-900 dark:text-white">1.2 GB / 100 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div className="bg-gray-800 dark:bg-gray-200 h-1 rounded-full" style={{ width: '1.2%' }}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Function Executions</span>
              <span className="text-gray-900 dark:text-white">234 / 1,000,000</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div className="bg-gray-900 dark:bg-gray-100 h-1 rounded-full" style={{ width: '0.02%' }}></div>
            </div>
          </div>
          <button className="w-full mt-3 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-center">
            View all usage →
          </button>
        </div>
      </div>
    </aside>
  );
}
