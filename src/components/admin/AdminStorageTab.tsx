import React, { useState, useEffect } from 'react';
import {
  Database,
  UploadCloud,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  FileImage,
  RefreshCw,
  Trash2,
  ExternalLink,
  Eye,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getSupabase,
  uploadFileToStorage,
  deleteFileFromStorage,
  listStorageFiles,
  STORAGE_BUCKETS,
  SUPABASE_SETUP_SQL
} from '../../lib/supabase';

interface BucketFile {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

export const AdminStorageTab: React.FC = () => {
  const isConfigured = isSupabaseConfigured();
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Active bucket
  const [activeBucket, setActiveBucket] = useState<string>(STORAGE_BUCKETS.GALLERY);
  const [files, setFiles] = useState<BucketFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Delete / Replace confirmation
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchBucketFiles(activeBucket);
  }, [activeBucket]);

  const fetchBucketFiles = async (bucket: string) => {
    setLoadingFiles(true);
    try {
      const res = await listStorageFiles(bucket, 'uploads');
      if (res.files && res.files.length > 0) {
        setFiles(res.files);
      } else {
        // Also check root folder
        const rootRes = await listStorageFiles(bucket, '');
        setFiles(rootRes.files || []);
      }
    } catch {
      setFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const supabase = getSupabase();
    if (!supabase) {
      setTestResult({
        success: false,
        message: 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) are missing.'
      });
      setTesting(false);
      return;
    }

    try {
      const { error } = await supabase.from('site_settings').select('id').limit(1);

      if (error) {
        if (error.code === '42P01') {
          setTestResult({
            success: false,
            message: 'Connected to Supabase project, but tables are not created yet. Please execute the SQL script in your Supabase SQL Editor.'
          });
        } else {
          setTestResult({
            success: false,
            message: `Supabase status notice: ${error.message}`
          });
        }
      } else {
        setTestResult({
          success: true,
          message: 'Connected to Supabase PostgreSQL & Storage! All services are active and ready.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection test error: ${err.message || 'Unknown network error'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null);
      setUploadedUrl(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(true);
    setUploadError(null);

    try {
      const res = await uploadFileToStorage(activeBucket, selectedFile, 'uploads');

      if (res.error) {
        setUploadError(res.error);
        setActionNotice({ type: 'error', message: `Upload error: ${res.error}` });
      } else if (res.url) {
        setUploadedUrl(res.url);
        setActionNotice({ type: 'success', message: `File uploaded successfully to ${activeBucket}!` });
        fetchBucketFiles(activeBucket);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(false);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName} from ${activeBucket}?`)) {
      return;
    }

    try {
      const path = `uploads/${fileName}`;
      const res = await deleteFileFromStorage(activeBucket, path);
      if (res.success) {
        setActionNotice({ type: 'success', message: `Deleted ${fileName} successfully.` });
        fetchBucketFiles(activeBucket);
      } else {
        setActionNotice({ type: 'error', message: res.error || 'Failed to delete file.' });
      }
    } catch (e: any) {
      setActionNotice({ type: 'error', message: e.message || 'Delete operation error.' });
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const getPublicFileUrl = (fileName: string) => {
    const supabase = getSupabase();
    if (!supabase) return '';
    const path = fileName.startsWith('uploads/') ? fileName : `uploads/${fileName}`;
    const { data } = supabase.storage.from(activeBucket).getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      {/* Header Status Box */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-[#FFD400]" />
            <h3 className="font-heading font-bold text-lg text-white">
              Supabase Storage & Database Hub
            </h3>
          </div>
          <p className="text-xs text-[#BDBDBD]">
            Direct management of public storage buckets: gym-gallery, trainer-images, transformation-images, testimonial-images.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
            isConfigured
              ? 'bg-[#00FF84]/15 border-[#00FF84]/40 text-[#00FF84]'
              : 'bg-[#FFD400]/15 border-[#FFD400]/40 text-[#FFD400]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-[#00FF84] animate-pulse' : 'bg-[#FFD400]'}`} />
            <span>{isConfigured ? 'Supabase Connected' : 'Local Fallback'}</span>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 rounded-xl bg-[#1f1f1f] hover:bg-[#282828] border border-white/10 text-white text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-[#FFD400]' : ''}`} />
            <span>{testing ? 'Verifying...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
          actionNotice.type === 'success'
            ? 'bg-[#00FF84]/15 border-[#00FF84]/40 text-[#00FF84]'
            : 'bg-[#FF4C61]/15 border-[#FF4C61]/40 text-[#FF4C61]'
        }`}>
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Connection Test Result */}
      {testResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          testResult.success
            ? 'bg-[#00FF84]/10 border-[#00FF84]/30 text-[#00FF84]'
            : 'bg-[#FF4C61]/10 border-[#FF4C61]/30 text-[#FF4C61]'
        }`}>
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Storage Bucket Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-[#121212] p-2 rounded-xl border border-white/10">
        {[
          { id: STORAGE_BUCKETS.GALLERY, label: 'Gym Gallery (gym-gallery)' },
          { id: STORAGE_BUCKETS.TRAINERS, label: 'Trainers (trainer-images)' },
          { id: STORAGE_BUCKETS.TRANSFORMATIONS, label: 'Transformations (transformation-images)' },
          { id: STORAGE_BUCKETS.TESTIMONIALS, label: 'Testimonials (testimonial-images)' }
        ].map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => setActiveBucket(bucket.id)}
            className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeBucket === bucket.id
                ? 'bg-[#FFD400] text-black'
                : 'text-[#BDBDBD] hover:text-white bg-transparent'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{bucket.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#FFD400]" />
              <h4 className="font-heading font-bold text-white text-sm">
                Upload Image to <span className="text-[#FFD400]">{activeBucket}</span>
              </h4>
            </div>
            <span className="text-[10px] text-[#BDBDBD] uppercase font-mono">Public Bucket</span>
          </div>

          <p className="text-xs text-[#BDBDBD]">
            Select an image from your device to upload, generate a public URL, and display across the D FITNESS website.
          </p>

          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-[#BDBDBD] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#202020] file:text-white hover:file:bg-[#303030] cursor-pointer"
            />

            {/* Image Preview Box */}
            {previewUrl && (
              <div className="p-3 rounded-xl bg-[#161616] border border-white/10 flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-white/10 shrink-0"
                />
                <div className="flex-1 space-y-1 text-xs">
                  <p className="font-semibold text-white truncate">{selectedFile?.name}</p>
                  <p className="text-[#888888]">
                    Size: {selectedFile ? Math.round(selectedFile.size / 1024) : 0} KB
                  </p>
                  <p className="text-[#FFD400] text-[11px]">Ready to upload to {activeBucket}</p>
                </div>
              </div>
            )}

            {selectedFile && (
              <div className="flex items-center justify-end">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="button-shine px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? 'UPLOADING TO BUCKET...' : 'UPLOAD NOW'}</span>
                </button>
              </div>
            )}

            {uploadError && (
              <div className="p-3 rounded-lg bg-[#FF4C61]/15 border border-[#FF4C61]/30 text-xs text-[#FF4C61] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadedUrl && (
              <div className="p-4 rounded-xl bg-[#161616] border border-[#00FF84]/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#00FF84] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>File successfully uploaded and published!</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="w-full px-3 py-2 rounded bg-[#101010] border border-white/10 text-xs text-[#BDBDBD] font-mono select-all"
                  />
                  <button
                    onClick={() => handleCopyUrl(uploadedUrl)}
                    className="p-2 rounded bg-[#252525] hover:bg-[#303030] text-white transition-colors shrink-0"
                    title="Copy URL"
                  >
                    {copiedUrl === uploadedUrl ? (
                      <Check className="w-4 h-4 text-[#00FF84]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bucket Files Listing */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FFD400]" />
              <h4 className="font-heading font-bold text-white text-sm">
                Files in {activeBucket}
              </h4>
            </div>

            <button
              onClick={() => fetchBucketFiles(activeBucket)}
              disabled={loadingFiles}
              className="p-1.5 rounded-lg bg-[#202020] text-[#BDBDBD] hover:text-white"
              title="Refresh files"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingFiles ? (
            <div className="py-8 text-center text-xs text-[#888888]">
              Loading bucket files...
            </div>
          ) : files.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <FileImage className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-xs text-[#888888]">
                No files uploaded to <code className="text-[#FFD400]">{activeBucket}</code> yet.
              </p>
              <p className="text-[11px] text-[#666666]">
                Upload your first image using the panel on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {files.map((file, idx) => {
                const url = getPublicFileUrl(file.name);
                return (
                  <div
                    key={file.name || idx}
                    className="p-3 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {url ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="w-10 h-10 rounded object-cover border border-white/10 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <FileImage className="w-6 h-6 text-[#FFD400] shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-[#888888]">
                          {file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : 'Uploaded file'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {url && (
                        <>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-[#252525] hover:bg-[#303030] text-[#BDBDBD] hover:text-white transition-colors"
                            title="Open file in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleCopyUrl(url)}
                            className="p-1.5 rounded bg-[#252525] hover:bg-[#303030] text-[#BDBDBD] hover:text-white transition-colors"
                            title="Copy link"
                          >
                            {copiedUrl === url ? (
                              <Check className="w-3.5 h-3.5 text-[#00FF84]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteFile(file.name)}
                        className="p-1.5 rounded bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FFD400]" />
            <h4 className="font-heading font-bold text-white text-sm">
              Complete Supabase PostgreSQL & Storage Schema
            </h4>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-xs text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#00FF84]" />
                <span className="text-[#00FF84]">Copied SQL</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Setup</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-[#BDBDBD]">
          Run this in <strong>Supabase Dashboard → SQL Editor</strong> to create all tables (<code className="text-[#FFD400]">admins</code>, <code className="text-[#FFD400]">leads</code>, <code className="text-[#FFD400]">programs</code>, <code className="text-[#FFD400]">trainers</code>, <code className="text-[#FFD400]">membership_plans</code>, <code className="text-[#FFD400]">gallery</code>, <code className="text-[#FFD400]">transformations</code>, <code className="text-[#FFD400]">testimonials</code>, <code className="text-[#FFD400]">faqs</code>, <code className="text-[#FFD400]">site_settings</code>) and public storage buckets.
        </p>

        <pre className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10 text-[11px] font-mono text-[#BDBDBD] overflow-x-auto max-h-64 leading-relaxed">
          {SUPABASE_SETUP_SQL}
        </pre>
      </div>
    </div>
  );
};
