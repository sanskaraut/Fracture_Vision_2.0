import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Scan, Target, Brain, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Scan,
            title: 'X-ray Upload',
            description: 'Upload bone X-ray images for instant AI analysis'
        },
        {
            icon: Brain,
            title: 'AI Detection',
            description: 'YOLO-powered fracture detection with high accuracy'
        },
        {
            icon: Target,
            title: 'Landmark Mapping',
            description: 'Mark critical points for precise fracture analysis'
        },
        {
            icon: Sparkles,
            title: '3D Visualization',
            description: 'View deformed bone models in interactive 3D'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Fracture Vision</span>
                </div>
                <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">AI-Powered Medical Analysis</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Advanced Bone
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Fracture Detection
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Revolutionize fracture analysis with cutting-edge YOLO AI, precise landmark mapping, and stunning 3D visualizations—all in one seamless platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/signin')}
                            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                        >
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/signin')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                        >
                            View Demo
                        </button>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className="group bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-white/20 transition-all"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">92%</div>
                        <div className="text-slate-400">AI Accuracy</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">&lt;2s</div>
                        <div className="text-slate-400">Processing Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-2">3D</div>
                        <div className="text-slate-400">Visualization</div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="relative z-10 container mx-auto px-6 py-8 mt-20 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                    <p>© 2026 Fracture Vision. Advanced Medical AI Platform.</p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Powered by YOLO AI & Three.js</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
