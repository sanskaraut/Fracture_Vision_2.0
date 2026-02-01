import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, sessionId } = location.state || {};

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>No Report Data. Please Start Over.</p>
        <button onClick={() => navigate("/")} className="ml-4 text-blue-400 underline">Go Home</button>
      </div>
    );
  }

  const severityColor = {
    mild: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    moderate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    severe: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-900 flex justify-center px-4 py-10 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="relative z-10 backdrop-blur-xl bg-white/5 border border-white/10 max-w-4xl w-full rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] custom-scrollbar">

        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Fracture Analysis Report
          </h1>
          <p className="text-slate-400">
            AI-driven diagnostic summary
          </p>
        </div>

        {/* CONFIDENCE */}
        <div className="mb-8 bg-black/20 rounded-xl p-6 border border-white/5">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-slate-300">
              AI Confidence Score
            </span>
            <span className="font-bold text-blue-400">
              {(data.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${data.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* DETECTED BONES */}
        <div className="mb-8">
          <h2 className="font-semibold text-slate-300 mb-3 text-sm uppercase tracking-wider">
            Detected Structures
          </h2>
          <div className="flex gap-3 flex-wrap">
            {data.detected_bones.map((bone, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium capitalize"
              >
                {bone}
              </span>
            ))}
          </div>
        </div>

        {/* FRACTURE DETAILS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {data.fractures.map((f, i) => (
            <div
              key={i}
              className={`border rounded-2xl p-6 transition hover:bg-white/5 ${severityColor[f.severity] || "border-white/10"}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold capitalize text-white">
                  {f.bone}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${severityColor[f.severity]
                    }`}
                >
                  {f.severity}
                </span>
              </div>

              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Damage Type</span>
                  <span className="font-semibold capitalize text-white">
                    {f.damage}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Location (Distal/Proximal)</span>
                  <span className="font-semibold text-white">
                    {(f.location * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>Upper Fragment Angle</span>
                  <span className="font-semibold text-white">
                    {f.top_angle.toFixed(1)}°
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Lower Fragment Angle</span>
                  <span className="font-semibold text-white">
                    {f.bottom_angle.toFixed(1)}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/visualize", { state: { sessionId, data } })}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all"
          >
            Visualize 3D Model
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-slate-800 text-slate-300 border border-slate-700 py-4 rounded-xl font-bold hover:bg-slate-700 hover:text-white transition-all"
          >
            Start New Analysis
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-slate-600 text-center mt-8">
          Generated for academic & research evaluation using Fracture Vision AI
        </p>
      </div>
    </motion.div>
  );
}
