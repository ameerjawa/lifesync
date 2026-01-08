import React from 'react';
import { Mail, Building, Phone, Link as LinkIcon, MapPin, Clock, Languages, User, Camera } from 'lucide-react';
import type { Profile } from '../../lib/types';

interface ProfileSettingsProps {
  profile: Profile | null;
  formData: any;
  setFormData: (data: any) => void;
  isUploading: boolean;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileSettings({ 
  profile, 
  formData, 
  setFormData,
  isUploading,
  handleAvatarUpload 
}: ProfileSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-full w-full p-4 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary-600 p-2 text-white hover:bg-primary-500">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{profile?.full_name}</h3>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300 bg-gray-50">
            <span className="inline-flex items-center px-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="block w-full rounded-r-lg border-0 bg-transparent px-4 py-2 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <Building className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <Phone className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <LinkIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <MapPin className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <Clock className="h-5 w-5 text-gray-400" />
            </span>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              {Intl.supportedValuesOf('timeZone').map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300">
            <span className="inline-flex items-center px-3">
              <Languages className="h-5 w-5 text-gray-400" />
            </span>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="block w-full rounded-r-lg border-0 px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}