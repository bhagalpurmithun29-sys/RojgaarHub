import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText, AlertTriangle, UserCheck } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function DocumentVerification() {
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>('unverified');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'aadhaar') setAadhaarFile(e.target.files[0]);
      else setPanFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  };

  const handleSubmit = async () => {
    if (!aadhaarFile || !panFile) {
      toast.error('Please select both Aadhaar and PAN documents.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload documents to Cloudinary via our backend endpoint
      toast.loading('Uploading documents to secure vault...', { id: 'kyc-upload' });
      const aadhaarUrl = await uploadFile(aadhaarFile);
      const panUrl = await uploadFile(panFile);

      // 2. Submit URLs to KYC profile endpoint
      toast.loading('Submitting for verification...', { id: 'kyc-upload' });
      const res = await api.post('/profiles/kyc', { aadhaarUrl, panUrl });
      
      setKycStatus('pending');
      toast.success(res.data.message || 'KYC Documents submitted successfully!', { id: 'kyc-upload' });
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload documents', { id: 'kyc-upload' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Identity Verification (KYC)</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Upload Aadhaar and PAN for Cloudinary-based secure verification.</p>
        </div>
      </div>

      {kycStatus === 'pending' ? (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-lg text-amber-900 dark:text-amber-400">Verification Pending</h3>
          <p className="text-sm text-amber-700 dark:text-amber-500">Your documents are securely uploaded and under review by our Admin team. You will be notified once approved.</p>
        </div>
      ) : kycStatus === 'approved' ? (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-400">KYC Verified</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-500">Your identity has been fully verified. You have earned the Verification Badge!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Aadhaar Upload Box */}
            <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl p-6 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-zinc-800/50 relative group">
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'aadhaar')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center space-y-3 relative z-0 pointer-events-none">
                <div className="mx-auto w-12 h-12 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Aadhaar Card (Front & Back)</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG or PDF (Max 5MB)</p>
                </div>
                {aadhaarFile && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {aadhaarFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* PAN Upload Box */}
            <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl p-6 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-zinc-800/50 relative group">
              <input 
                type="file" 
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'pan')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center space-y-3 relative z-0 pointer-events-none">
                <div className="mx-auto w-12 h-12 rounded-full bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">PAN Card</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG or PDF (Max 5MB)</p>
                </div>
                {panFile && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {panFile.name}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <UploadCloud className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Documents are securely uploaded to our encrypted vault. By submitting, you agree to our verification terms. Watermarks are automatically applied.
            </p>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isUploading || !aadhaarFile || !panFile}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex justify-center items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Upload...
              </>
            ) : (
              'Submit Documents for KYC'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
