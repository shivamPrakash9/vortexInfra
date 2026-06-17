import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-vortex-cream dark:bg-vortex-black font-sans selection:bg-primary/30 transition-colors duration-300 px-6 relative overflow-hidden">

            {/* Abstract Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="text-center max-w-2xl mx-auto relative z-10">

                {/* The Huge 404 Text */}
                <h1 className="text-[8rem] md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-vortex-charcoal to-vortex-charcoal/10 dark:from-white dark:to-white/10 leading-none tracking-tighter mb-4">
                    404
                </h1>

                {/* Architectural Messaging */}
                <h2 className="text-3xl md:text-4xl font-black text-vortex-charcoal dark:text-white mb-6 tracking-tight">
                    Uncharted Space.
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light mb-12 leading-relaxed max-w-md mx-auto">
                    The blueprint for this page doesn't exist. It may have been moved, deleted, or is still under construction.
                </p>

                {/* Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-vortex-dark text-vortex-charcoal dark:text-white border border-gray-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 group"
                    >
                        <Home size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        Return Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default NotFound;