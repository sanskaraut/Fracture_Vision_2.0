import { useState } from "react";
import { uploadXray } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, FilePlus, Activity, LogOut, User, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UploadXray() {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleXrayUpload = async (file) => {
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadXray(file);
      navigate("/landmarks", {
        state: {
          sessionId: res.session_id,
          xrayImage: res.image_base64
        }
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload X-ray. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleXrayUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleXrayUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Fracture Vision</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-4 py-2">
              <User className="w-5 h-5 text-slate-400" />
              <span className="text-white text-sm">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Upload X-ray Image</h1>
            <p className="text-slate-400 text-lg">
              Upload a bone X-ray for AI-powered fracture detection
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`
              relative group min-h-[400px] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-12
              ${dragActive
                ? "border-blue-500 bg-blue-500/5 scale-[1.01]"
                : "border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
                <h3 className="text-2xl font-bold animate-pulse text-white">Analyzing Radiography...</h3>
                <p className="text-slate-400 mt-2">Uploading and processing X-ray image</p>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-white">Drop your X-ray here</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                  Drag & drop your X-ray image file or click browse to select
                </p>

                <label className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200" />
                  <button className="relative px-8 py-4 bg-slate-900 rounded-xl flex items-center space-x-3 hover:bg-slate-800 transition-colors pointer-events-none border border-white/10">
                    <FilePlus className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-lg text-white">Browse Files</span>
                  </button>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.dcm"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                  />
                </label>

                <p className="text-slate-500 text-sm mt-6">
                  Supported formats: JPG, PNG, DICOM
                </p>
              </>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">📤</div>
              <div className="text-white font-semibold mb-1">Step 1</div>
              <div className="text-slate-400 text-sm">Upload X-ray</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">📍</div>
              <div className="text-white font-semibold mb-1">Step 2</div>
              <div className="text-slate-400 text-sm">Mark Landmarks</div>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-white font-semibold mb-1">Step 3</div>
              <div className="text-slate-400 text-sm">View Results</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
