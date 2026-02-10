import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LandmarkCanvas from "../components/LandmarkCanvas";

export default function MarkLandmarks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, xrayImage } = location.state || {};

  const handleDone = (data) => {
    navigate("/report", {
      state: {
        data,
        sessionId
      }
    });
  };

  if (!sessionId || !xrayImage) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>No Session Data. Please Start Over.</p>
        <button onClick={() => navigate("/dashboard")} className="ml-4 text-blue-400 underline">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Bone Structure Analysis
          </h2>
          <p className="text-slate-400 text-sm">
            Please precisely mark the 4 key anatomical points on the X-ray
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <LandmarkCanvas
            image={xrayImage}
            sessionId={sessionId}
            onSubmit={handleDone}
          />
        </div>
      </div>
    </motion.div>
  );
}
