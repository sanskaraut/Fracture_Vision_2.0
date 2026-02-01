import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Activity, AlertTriangle, Maximize2, Minimize2 } from "lucide-react";
import ModelViewer from "../components/ModelViewer";

export default function VisualizeModel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, data } = location.state || {};
  const [showInfo, setShowInfo] = useState(true);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>No Session ID. Please Start Over.</p>
        <button onClick={() => navigate("/")} className="ml-4 text-blue-400 underline">Go Home</button>
      </div>
    );
  }

  const toggleInfo = () => setShowInfo(!showInfo);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-900 relative overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900/20 pointer-events-none" />

      {/* 3D Viewer Area - Full Screen */}
      <div className="absolute inset-0 z-0">
        <ModelViewer sessionId={sessionId} />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-slate-900/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Toggle Info Button */}
        <div className="pointer-events-auto">
          <button
            onClick={toggleInfo}
            className="p-3 bg-slate-900/50 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-white/10 transition-all"
          >
            {showInfo ? <Minimize2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Floating Info Panel */}
      <AnimatePresence>
        {showInfo && data && data.fractures && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 right-6 z-10 w-80 max-h-[80vh] overflow-y-auto custom-scrollbar pointer-events-auto"
          >
            <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl shadow-2xl p-5 text-white">
              <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Fracture Details</h3>
              </div>

              <div className="space-y-4">
                {data.fractures.map((f, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg capitalize">{f.bone}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${f.severity === 'severe' ? 'bg-red-500/20 text-red-400' :
                          f.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-emerald-500/20 text-emerald-400'
                        }`}>
                        {f.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Proximal Angle</span>
                        <span className="font-mono text-white">{f.top_angle.toFixed(1)}°</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Distal Angle</span>
                        <span className="font-mono text-white">{f.bottom_angle.toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>
                ))}

                {data.fractures.length === 0 && (
                  <div className="text-center py-4 text-slate-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No fractures detected.</p>
                  </div>
                )}
              </div>

              {/* Confidence Meter */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>AI Confidence</span>
                  <span>{(data.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${data.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
