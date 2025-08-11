import React from 'react';
import { Sparkles, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">LifeSync</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your all-in-one platform for life management and personal growth.
            </p>
            <div className="space-y-2">
              <a href="mailto:contact@lifesync.app" className="flex items-center text-gray-400 hover:text-white">
                <Mail className="h-5 w-5 mr-2" />
                contact@lifesync.app
              </a>
              <a href="tel:+1234567890" className="flex items-center text-gray-400 hover:text-white">
                <Phone className="h-5 w-5 mr-2" />
                (123) 456-7890
              </a>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavigation('features')}
                  className="text-gray-400 hover:text-white"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('pricing')}
                  className="text-gray-400 hover:text-white"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">About Us</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">API Reference</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">System Status</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Security</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Compliance</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} LifeSync. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://twitter.com/lifesync" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="https://linkedin.com/company/lifesync" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
              <a href="https://github.com/lifesync" className="text-gray-400 hover:text-white">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}