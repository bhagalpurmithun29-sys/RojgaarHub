import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText, AlertTriangle, UserCheck, Briefcase } from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ContractorVerification() {
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [businessRegFile, setBusinessRegFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    aadhaarNumber: '',
    companyName: '',
    panNumber: '',
    gstNumber: '',
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>('unverified');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'selfie' | 'tradeLicense' | 'businessReg' | 'bank') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'aadhaar') setAadhaarFile(file);
      else if (type === 'selfie') setSelfieFile(file);
      else if (type === 'tradeLicense') setTradeLicenseFile(file);
      else if (type === 'businessReg') setBusinessRegFile(file);
      else if (type === 'bank') setBankFile(file);
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
    if (!aadhaarFile || !selfieFile || !tradeLicenseFile || !businessRegFile || !bankFile || !formData.aadhaarNumber || !formData.panNumber || !formData.accountNumber) {
      toast.error('Please fill all mandatory fields and upload required documents.');
      return;
    }

    setIsUploading(true);
    try {
      toast.loading('Uploading documents to secure vault...', { id: 'kyc-upload' });
      const aadhaarUrl = await uploadFile(aadhaarFile);
      const selfieUrl = await uploadFile(selfieFile);
      const tradeLicenseUrl = await uploadFile(tradeLicenseFile);
      const businessRegUrl = await uploadFile(businessRegFile);
      const bankUrl = await uploadFile(bankFile);

      toast.loading('Submitting for verification...', { id: 'kyc-upload' });
      const payload = { ...formData, aadhaarUrl, selfieUrl, tradeLicenseUrl, businessRegUrl, bankUrl };
      const res = await api.post('/profiles/kyc', payload);
      
      setKycStatus('pending');
      toast.success(res.data.message || 'KYC Documents submitted successfully!', { id: 'kyc-upload' });
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload documents', { id: 'kyc-upload' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 dark:border-zinc-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Contractor KYC Verification</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Complete your personal, business, and bank verification.</p>
        </div>
      </div>

      {kycStatus === 'pending' ? (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-bold text-lg text-amber-900 dark:text-amber-400">Verification Pending</h3>
          <p className="text-sm text-amber-700 dark:text-amber-500">Your documents are securely uploaded and under review by our Admin team. You will be notified once approved.</p>
          <button onClick={() => setKycStatus('unverified')} className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors mx-auto block">
            View / Edit Form
          </button>
        </div>
      ) : kycStatus === 'approved' ? (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-400">KYC Verified</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-500">Your identity and business details have been fully verified. You have earned the Verification Badge!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Identity Verification Section */}
          <div className="bg-gray-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">1. Personal Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" placeholder="As per Aadhaar" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Aadhaar Number <span className="text-red-500">*</span></label><input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} maxLength={12} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-white dark:bg-zinc-800 relative group text-center">
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhaar')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <FileText className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800 dark:text-white">Aadhaar Upload <span className="text-red-500">*</span></p>
                {aadhaarFile && <p className="text-xs text-green-500 mt-1 truncate">{aadhaarFile.name}</p>}
              </div>
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-white dark:bg-zinc-800 relative group text-center">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'selfie')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <UserCheck className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800 dark:text-white">Selfie Upload <span className="text-red-500">*</span></p>
                {selfieFile && <p className="text-xs text-green-500 mt-1 truncate">{selfieFile.name}</p>}
              </div>
            </div>
          </div>

          {/* Business Verification Section */}
          <div className="bg-gray-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">2. Business Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Company / Business Name <span className="text-red-500">*</span></label><input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">PAN Number <span className="text-red-500">*</span></label><input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div className="md:col-span-2"><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">GST Number (Optional)</label><input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-white dark:bg-zinc-800 relative group text-center">
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'tradeLicense')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <FileText className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800 dark:text-white">Trade License <span className="text-red-500">*</span></p>
                {tradeLicenseFile && <p className="text-xs text-green-500 mt-1 truncate">{tradeLicenseFile.name}</p>}
              </div>
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-white dark:bg-zinc-800 relative group text-center">
                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'businessReg')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <Briefcase className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-gray-800 dark:text-white">Business Registration <span className="text-red-500">*</span></p>
                {businessRegFile && <p className="text-xs text-green-500 mt-1 truncate">{businessRegFile.name}</p>}
              </div>
            </div>
          </div>

          {/* Bank Verification Section */}
          <div className="bg-gray-50 dark:bg-zinc-800/30 p-6 rounded-2xl border border-gray-200 dark:border-zinc-700 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white">3. Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Account Holder Name</label><input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Bank Name</label><input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">Account No. <span className="text-red-500">*</span></label><input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold text-gray-600 dark:text-zinc-400">IFSC Code <span className="text-red-500">*</span></label><input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full mt-1 p-2.5 rounded-xl border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-indigo-500" /></div>
            </div>
            <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-white dark:bg-zinc-800 relative group text-center mt-4">
              <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'bank')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <p className="font-bold text-sm text-gray-800 dark:text-white">Cancelled Cheque Upload <span className="text-red-500">*</span></p>
              {bankFile && <p className="text-xs text-green-500 mt-1 truncate">{bankFile.name}</p>}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <UploadCloud className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Documents are securely uploaded to our encrypted vault. By submitting, you agree to our verification terms.
            </p>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isUploading}
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
