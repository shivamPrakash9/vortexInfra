import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import { themeConfig } from '../config/theme';
import { supabase } from '../supabaseClient';

interface NavbarProps {
    isDark: boolean;
    setIsDark: (value: boolean) => void;
}

const Navbar = ({ isDark, setIsDark }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 1. Add state to hold the dynamic backend data
    const [company, setCompany] = useState<any>(null);

    // 2. Fetch the company data on load
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const { data } = await supabase.from('company').select('*').eq('id', 1).maybeSingle();
                if (data) setCompany(data);
            } catch (error) {
                console.error("Error fetching company data for Navbar:", error);
            }
        };
        fetchCompanyData();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg py-4 shadow-sm' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-300 overflow-hidden shrink-0">
                        {/* 3. Use dynamic logo with local fallback */}
                        <img
                            src={company?.logo_url || "/Logo.png"}
                            alt={company?.name || "Vortex Logo"}
                            className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {/* 4. Use dynamic name with config fallback */}
                        {company?.name || themeConfig.brandName}
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest text-slate-600 dark:text-slate-300">
                    {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                        <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            className="hover:text-primary transition-colors duration-200">
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:scale-110 transition-transform">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <Link to="/contact" className="group relative px-6 py-2.5 bg-primary text-secondary font-black text-sm uppercase tracking-wider rounded-full overflow-hidden hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                        <span className="relative z-10 flex items-center gap-2">
                            Book Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={() => setIsDark(!isDark)} className="p-2 text-slate-700 dark:text-yellow-400">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="p-2 text-slate-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] py-6' : 'max-h-0 py-0'}`}>
                <div className="flex flex-col px-6 gap-4 font-bold text-lg text-slate-900 dark:text-white">
                    {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                        <Link
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            onClick={() => setIsOpen(false)} // Closes menu on click
                            className="hover:text-primary transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                    <Link
                        to="/contact"
                        onClick={() => setIsOpen(false)}
                        className="mt-4 text-center bg-primary text-secondary py-3 rounded-xl font-black uppercase tracking-wider"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;