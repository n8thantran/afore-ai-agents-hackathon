'use client';

import { Github } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Deploy</h1>
          <p className="text-gray-400 text-sm">
            Deploy your projects with zero configuration
          </p>
        </div>

        {/* Login Button */}
        <button
          onClick={onLogin}
          className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 mb-6"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        {/* Features */}
        <div className="text-left space-y-4 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Zero Configuration</p>
              <p>Import your Git repository and deploy instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Automatic Deployments</p>
              <p>Every push to your repository triggers a new deployment</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium">Global CDN</p>
              <p>Your site is deployed to our global edge network</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-white hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-white hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
