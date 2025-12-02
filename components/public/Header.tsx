
import React from 'react';
import { Button } from '../common/UI';
import { Anchor } from 'lucide-react';

export const PublicHeader = ({ onNavigate }: { onNavigate: (v: string) => void }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Anchor size={24} />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">SeaLearn</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-1">
          {['Home', 'Institutions', 'About', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => onNavigate(item.toLowerCase() === 'home' ? 'home' : item.toLowerCase())}
              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
             onClick={() => onNavigate('login')}
             className="hidden md:block font-medium text-slate-600 hover:text-blue-600"
          >
            Login
          </button>
          <Button onClick={() => onNavigate('register')}>Get Started</Button>
        </div>
      </div>
    </div>
  </header>
);
