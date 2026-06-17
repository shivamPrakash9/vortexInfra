import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    Settings, Briefcase, LayoutGrid, Users, BookOpen,
    Star, MessageSquare, LogOut, ShieldCheck
} from 'lucide-react';

// Import all your manager components
import CompanySettings from '../components/admin/CompanySettings';
import PortfolioManager from '../components/admin/PortfolioManager';
import ServicesManager from '../components/admin/ServicesManager';
import TeamManager from '../components/admin/TeamManager';
import StoryManager from '../components/admin/StoryManager';
import TestimonialManager from '../components/admin/TestimonialManager';
import MessageManager from '../components/admin/MessageManager';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('company');
    const navigate = useNavigate();

    // --- 1. MANUAL LOGOUT FUNCTION ---
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin', { replace: true });
    };

    // --- 2. AUTO-LOGOUT SECURITY HOOK ---
    useEffect(() => {
        // SECURITY GUARD: Check if the user is actually logged in when this page loads
        const enforceSecurity = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Kick them out if they use the back button without an active session
                navigate('/login', { replace: true });
            }
        };

        enforceSecurity();

        // Fires when the user closes the browser tab or refreshes
        const handleTabClose = () => {
            supabase.auth.signOut();
        };

        window.addEventListener('beforeunload', handleTabClose);

        // Fires when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
            // We don't want to force sign out on unmount anymore, 
            // otherwise clicking a link to your Home page would log you out!
        };
    }, [navigate]);

    const navItems = [
        { id: 'company', label: 'Company Settings', icon: <Settings size={20} /> },
        { id: 'portfolio', label: 'Portfolio', icon: <LayoutGrid size={20} /> },
        { id: 'services', label: 'Services', icon: <Briefcase size={20} /> },
        { id: 'team', label: 'Team', icon: <Users size={20} /> },
        { id: 'stories', label: 'Stories', icon: <BookOpen size={20} /> },
        { id: 'testimonials', label: 'Testimonials', icon: <Star size={20} /> },
        { id: 'messages', label: 'Inbox & Leads', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

            {/* LEFT SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-black flex items-center gap-2">
                        <span className="text-primary">V</span> Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Control Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id
                                    ? 'bg-primary text-slate-900 shadow-md'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* RIGHT SIDE: HEADER + MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* TOP NAVBAR / HEADER */}
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-800">
                        <ShieldCheck className="text-green-500" size={24} />
                        <h2 className="text-xl font-black">
                            Dashboard <span className="text-gray-400 font-medium">/ {navItems.find(n => n.id === activeTab)?.label}</span>
                        </h2>
                    </div>

                    {/* SECURE LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all shadow-sm"
                        title="Log out and secure session"
                    >
                        <LogOut size={18} />
                        Secure Logout
                    </button>
                </header>

                {/* MAIN DYNAMIC CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-6xl mx-auto">
                        {activeTab === 'company' && <CompanySettings />}
                        {activeTab === 'portfolio' && <PortfolioManager />}
                        {activeTab === 'services' && <ServicesManager />}
                        {activeTab === 'team' && <TeamManager />}
                        {activeTab === 'stories' && <StoryManager />}
                        {activeTab === 'testimonials' && <TestimonialManager />}
                        {activeTab === 'messages' && <MessageManager />}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default AdminDashboard;