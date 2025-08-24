'use client';

import { Bell, Search, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  onSyncComplete?: () => void;
}

export function Header({}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const [repoSuggestions, setRepoSuggestions] = useState<Array<{ id: number; name: string; full_name: string; html_url: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const navClass = (href: string) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return [
      'text-sm transition-colors',
      active
        ? 'text-black dark:text-white font-semibold'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    ].join(' ');
  };

  useEffect(() => {
    let cancelled = false;
    const loadRepos = async () => {
      try {
        const res = await fetch('/api/repos');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setRepoSuggestions(
            (data || []).map((r: { id: number; name: string; full_name: string; html_url: string }) => ({ id: r.id, name: r.name, full_name: r.full_name, html_url: r.html_url }))
          );
        }
      } catch {
        // ignore
      }
    };
    if (session) loadRepos();
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Array<{ id: number; name: string; full_name: string; html_url: string }>;
    return repoSuggestions
      .filter((r) => r.name.toLowerCase().startsWith(q) || r.full_name.toLowerCase().startsWith(q))
      .slice(0, 8);
  }, [query, repoSuggestions]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 h-20 flex items-center justify-between px-8 shadow-sm">
      {/* Logo and Navigation */}
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-2xl text-black dark:text-white">OpsPilot</span>
            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">DevOps Manager</div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className={navClass('/')}>Dashboard</Link>
          <Link href="/chat" className={navClass('/chat')}>Chat</Link>
          <Link href="/repo" className={navClass('/repo')}>Repositories</Link>
          <Link href="/analytics" className={navClass('/analytics')}>Analytics</Link>
        </nav>
      </div>

      {/* Search and User Menu */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div ref={searchRef} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = query.trim();
                router.push(q ? `/repo?search=${encodeURIComponent(q)}` : '/repo');
                setShowSuggestions(false);
              }
            }}
            onFocus={() => setShowSuggestions(!!query.trim())}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 p-2">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      const q = s.name;
                      setQuery(q);
                      setShowSuggestions(false);
                      router.push(`/repo?search=${encodeURIComponent(q)}`);
                    }}
                    className="px-2.5 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.user?.email || 'user@example.com'}
                </p>
              </div>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <User className="w-4 h-4" />
                Profile
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Settings className="w-4 h-4" />
                Settings
              </a>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
