import React from 'react';
import { X } from 'lucide-react';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void);
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  type = "button",
  disabled = false
}) => {
  const baseStyle = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95 shadow-md";
  const disabledStyle = "opacity-50 cursor-not-allowed transform-none shadow-none";
  
  const variants: Record<string, string> = {
    // Modified to use CSS variables defined in index.html
    primary: "bg-gradient-to-r from-theme-primary to-theme-secondary text-white hover:from-theme-primary-hover hover:to-theme-secondary-hover hover:shadow-lg",
    secondary: "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 hover:shadow-teal-500/25",
    danger: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 hover:shadow-rose-500/25",
    outline: "bg-white border-2 border-slate-200 text-slate-600 hover:border-theme-primary hover:text-theme-primary hover:bg-theme-soft shadow-none"
  };
  
  return (
    <button 
      type={type} 
      onClick={disabled ? undefined : onClick as React.MouseEventHandler<HTMLButtonElement>} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? disabledStyle : ''}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", placeholder, value, onChange, disabled = false }: any) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <input 
      type={type} 
      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-theme-ring focus:border-transparent outline-none transition-all placeholder:text-slate-400 hover:bg-white ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};