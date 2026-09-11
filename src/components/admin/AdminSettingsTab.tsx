import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, MapPin, Phone, Mail, Clock, Globe, AlertCircle, RefreshCw, Info, ExternalLink } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { SiteSettings } from '../../types';
import { sanitizeMapsEmbedUrl } from '../../lib/mapUtils';

export const AdminSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await supabaseService.getSiteSettings();
      setSettings(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings((prev) => ({
      ...prev!,
      [field]: value
    }));
  };

  const handleEmbedUrlChange = (value: string) => {
    if (!settings) return;
    // Auto sanitize so if admin pastes <iframe src="..."> it extracts the clean URL
    const cleanUrl = sanitizeMapsEmbedUrl(value);
    setSettings((prev) => ({
      ...prev!,
      mapsEmbedUrl: cleanUrl
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);

    try {
      const res = await supabaseService.saveSiteSettings(settings);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setError(res.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-8 text-center text-xs text-[#888888] flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#FFD400]" />
        <span>Loading site settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121212] p-6 rounded-2xl border border-white/10">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Gym Contact, Location & Google Maps Configuration
          </h3>
          <p className="text-xs text-[#BDBDBD] mt-1">
            Update phone numbers, WhatsApp, Godda facility location, Google Maps iframe embed, and weekly workout hours.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="button-shine px-6 py-2.5 rounded-xl bg-[#FFD400] text-black font-heading font-bold text-xs flex items-center gap-2 disabled:opacity-50 hover:bg-[#FFE600] transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING CHANGES...' : 'SAVE SETTINGS'}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-[#00FF84]/15 border border-[#00FF84]/40 flex items-center gap-2 text-xs text-[#00FF84]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved to Supabase! The live D FITNESS website reflects your updates instantly.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[#FF4C61]/15 border border-[#FF4C61]/40 flex items-center gap-2 text-xs text-[#FF4C61]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm border-b border-white/10 pb-3">
            <Phone className="w-4 h-4 text-[#FFD400]" />
            <span>Direct Communication</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Primary Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              WhatsApp Number (with Country Code e.g. 919142413009)
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Official Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm border-b border-white/10 pb-3">
            <Clock className="w-4 h-4 text-[#FFD400]" />
            <span>Godda Facility Operating Hours</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Monday - Saturday Hours
            </label>
            <input
              type="text"
              value={settings.openingHoursWeekday}
              onChange={(e) => handleChange('openingHoursWeekday', e.target.value)}
              placeholder="05:30 AM – 10:00 PM (Monday – Saturday)"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Sunday Hours
            </label>
            <input
              type="text"
              value={settings.openingHoursWeekend}
              onChange={(e) => handleChange('openingHoursWeekend', e.target.value)}
              placeholder="06:00 AM – 01:00 PM (Sunday)"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="CARDIO | STRENGTH | WEIGHT LOSS"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>
        </div>

        {/* Physical Address & Direct Map URL */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm border-b border-white/10 pb-3">
            <MapPin className="w-4 h-4 text-[#FFD400]" />
            <span>Godda Physical Address & Direct Navigation</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Physical Gym Street Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Gangta Rd, Fasia Dangal, Godda, Jharkhand 814133"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Google Maps Navigation Link (Directions)
            </label>
            <input
              type="url"
              value={settings.mapsUrl}
              onChange={(e) => handleChange('mapsUrl', e.target.value)}
              placeholder="https://maps.app.goo.gl/XEF7T2Sowxi9qSrt5"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
            <p className="text-[10px] text-[#888888] mt-1">
              Used for "Open in Google Maps" direction buttons across the site.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm border-b border-white/10 pb-3">
            <Globe className="w-4 h-4 text-[#FFD400]" />
            <span>Social Presence</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={settings.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/dfitness_godda"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={settings.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/dfitnessgodda"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>
        </div>
      </div>

      {/* Full Width Google Maps Embed URL & Live Preview */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
            <MapPin className="w-4 h-4 text-[#00FF84]" />
            <span>Google Maps Interactive Embed (VITE_GOOGLE_MAPS_EMBED_URL)</span>
          </div>
          <span className="text-[11px] font-mono text-[#FFD400] bg-[#FFD400]/10 px-2 py-0.5 rounded border border-[#FFD400]/20">
            Contact Page & Location Showcase
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-[#BDBDBD] uppercase">
              Google Maps Embed URL or Full iframe snippet
            </label>
            <span className="text-[10px] text-[#00FF84] font-medium">Auto-extracted & validated</span>
          </div>

          <textarea
            rows={3}
            value={settings.mapsEmbedUrl}
            onChange={(e) => handleEmbedUrlChange(e.target.value)}
            placeholder="Paste either direct URL (https://www.google.com/maps/embed?pb=...) or the full HTML snippet (<iframe src=...></iframe>)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white font-mono text-xs outline-none focus:border-[#00FF84]"
          />

          <div className="p-3 rounded-xl bg-[#181818] border border-white/5 space-y-1.5 text-xs text-[#BDBDBD]">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Info className="w-3.5 h-3.5 text-[#FFD400]" />
              <span>How to obtain the Google Maps Embed URL:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#888888] pl-1">
              <li>Open Google Maps and search for <strong className="text-white">D FITNESS Godda</strong> (or your facility location).</li>
              <li>Click the <strong className="text-white">Share</strong> button on the place card.</li>
              <li>Select the <strong className="text-white">Embed a map</strong> tab.</li>
              <li>Click <strong className="text-white">Copy HTML</strong> and paste it directly into the input above (or set <code className="text-[#FFD400]">VITE_GOOGLE_MAPS_EMBED_URL</code> in environment variables).</li>
            </ol>
          </div>
        </div>

        {/* Live Interactive Map Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-semibold text-[#BDBDBD] uppercase">Live Map Preview</span>
            {settings.mapsEmbedUrl && (
              <span className="text-[11px] text-[#00FF84] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Valid Embed URL
              </span>
            )}
          </div>

          <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-white/10 bg-black relative">
            {settings.mapsEmbedUrl ? (
              <iframe
                title="Google Maps Live Preview"
                src={sanitizeMapsEmbedUrl(settings.mapsEmbedUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#888888]">
                No embed URL configured. Default Godda location will be used.
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
