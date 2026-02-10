import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, LogOut, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <nav className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Fracture Vision</span>
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
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Welcome back, {user?.name || 'Doctor'}! 👋
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Start analyzing bone fractures with AI-powered precision
                        </p>
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">New Analysis</h2>
                                <p className="text-slate-400">Upload an X-ray image to get started</p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                                <Upload className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/upload')}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Upload X-ray Image</span>
                        </button>
                    </div>

                    {/* Features Overview */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-white mb-2">1</div>
                            <div className="text-slate-400 text-sm">Upload X-ray</div>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-white mb-2">2</div>
                            <div className="text-slate-400 text-sm">Mark Landmarks</div>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <div className="text-3xl font-bold text-white mb-2">3</div>
                            <div className="text-slate-400 text-sm">View 3D Model</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
