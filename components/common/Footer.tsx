
import React from 'react';
import { Anchor, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white mb-4">
              <Anchor className="text-teal-400" size={32} />
              <span className="font-bold text-2xl tracking-tight">SeaLearn</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering seafarers worldwide with access to world-class training, connecting top-tier institutions with the maritime workforce of tomorrow.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-teal-500 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-teal-500 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-teal-500 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-teal-500 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors flex items-center gap-2">Find Courses</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors flex items-center gap-2">Institutions</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors flex items-center gap-2">Verify Certificates</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors flex items-center gap-2">Success Stories</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors flex items-center gap-2">Latest News</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">For Vendors</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Cookie Settings</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group cursor-pointer">
                <MapPin size={20} className="text-teal-400 shrink-0 mt-1 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">123 Ocean Drive, Marina Bay,<br/>Singapore 018956</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Phone size={20} className="text-teal-400 shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">+65 6789 0123</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Mail size={20} className="text-teal-400 shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">hello@sealearn.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SeaLearn. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-slate-300">Privacy</a>
             <a href="#" className="hover:text-slate-300">Terms</a>
             <a href="#" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
