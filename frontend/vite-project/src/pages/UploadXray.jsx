import { useState } from "react";
import { uploadXray } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud, FilePlus, Activity, Clock,
  Settings, LogOut, LayoutDashboard, User,
  ChevronRight, FileText
} from "lucide-react";

export default function UploadXray() {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col relative z-20"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Fracture<span className="text-blue-400">Vision</span></span>
          </div>

          <nav className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Alex Smith</p>
              <p className="text-xs text-slate-500">Orthopedics</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm w-full">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="p-8 max-w-7xl mx-auto relative z-10 flex flex-col h-full">

          <header className="mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard Overview</h1>
              <p className="text-slate-400">Welcome back, get started with a new analysis.</p>
            </div>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            {/* UPLOAD AREA (Hero) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-3xl"
            >
              <div
                className={`
                  relative group min-h-[450px] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-12
                  ${dragActive
                    ? "border-blue-500 bg-blue-500/5 scale-[1.01]"
                    : "border-slate-700 bg-white/5 hover:border-slate-500 hover:bg-white/10"
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
                    <h3 className="text-2xl font-bold animate-pulse">Analyzing Radiography...</h3>
                    <p className="text-slate-400 mt-2">Uploading and processing X-ray image</p>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3">Upload New X-Ray</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                      Drag & drop your DICOM or Image file here to start the AI fracture detection process.
                    </p>

                    <label className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200" />
                      <button className="relative px-8 py-4 bg-slate-900 rounded-xl flex items-center space-x-3 hover:bg-slate-800 transition-colors pointer-events-none border border-white/10">
                        <FilePlus className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-lg">Browse Files</span>
                      </button>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.dcm"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleChange}
                      />
                    </label>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`
        flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({ label, value, change }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-md min-w-[140px]">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold">{value}</span>
        <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded ml-2">{change}</span>
      </div>
    </div>
  );
}
