import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import UploadXray from "./pages/UploadXray";
import MarkLandmarks from "./pages/MarkLandmarks";
import Report from "./pages/Report";
import VisualizeModel from "./pages/VisualizeModel";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<UploadXray />} />
        <Route path="/landmarks" element={<MarkLandmarks />} />
        <Route path="/report" element={<Report />} />
        <Route path="/visualize" element={<VisualizeModel />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans antialiased selection:bg-blue-500/30">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
