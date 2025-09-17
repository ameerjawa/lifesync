import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Save, Upload, Camera } from 'lucide-react';
import { useBusinessStore } from '../../store/businessStore';
import { supabase } from '../../lib/supabase';

export function BusinessSettings() {
  const { profile, updateBusinessProfile } = useBusinessStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || '',
    industry: profile?.industry || '',
    description: profile?.description || '',
    website: profile?.website || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: profile?.address || '',
    logo_url: profile?.logo_url || '',
    staff_count: profile?.staff_count || 1,
    business_type: profile?.business_type || 'llc',
    annual_revenue: profile?.annual_revenue || '',
    tax_id: profile?.tax_id || ''
  });

  const handleSave = async () => {
    setIsSaving(true);

    console.log(formData);
    try {
      await updateBusinessProfile({
        ...formData,
        annual_revenue: formData.annual_revenue ? Number(formData.annual_revenue) : undefined
      });
    } catch (error) {
      console.error('Error saving business settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;
      // TODO: Implement logo upload to storage
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));   
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setIsUploading(false);
    }
  };

 useEffect(() => {
  if (!selectedFile) return;

  console.log(selectedFile);
  const uploadFile = async () => {
    try {
      const user = supabase.auth.getUser(); // async in latest SDK
if (!user) throw new Error("User must be signed in to upload");
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(filePath, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("business-assets")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  uploadFile();
}, [selectedFile]);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Settings</h2>
        <p className="text-gray-600">Manage your business profile and preferences</p>
      </div>

      {/* Business Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Profile</h3>
        
        {/* Logo Upload */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
              {profile?.logo_url || previewUrl ? (
                <img
                  src={previewUrl || profile?.logo_url}
                  alt="Business logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building className="h-full w-full p-4 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-500">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">{profile?.company_name}</h4>
            <p className="text-sm text-gray-500">{profile?.industry}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="consulting">Consulting</option>
              <option value="marketing">Marketing</option>
              <option value="real_estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <select
              id="business_type"
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="corporation">Corporation</option>
              <option value="llc">LLC</option>
              <option value="nonprofit">Nonprofit</option>
            </select>
          </div>

          <div>
            <label htmlFor="staff_count" className="block text-sm font-medium text-gray-700">
              Staff Count
            </label>
            <input
              type="number"
              id="staff_count"
              value={formData.staff_count}
              onChange={(e) => setFormData({ ...formData, staff_count: parseInt(e.target.value) || 1 })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Business Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Business Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">
              Tax ID / EIN
            </label>
            <input
              type="text"
              id="tax_id"
              value={formData.tax_id}
              onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Business Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Business Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="annual_revenue" className="block text-sm font-medium text-gray-700">
            Annual Revenue
          </label>
          <input
            type="number"
            id="annual_revenue"
            value={formData.annual_revenue}
            onChange={(e) => setFormData({ ...formData, annual_revenue: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="1000"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}