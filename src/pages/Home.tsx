import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sofa, DoorOpen, BedDouble, MonitorPlay, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { themeConfig } from '../config/theme';
import { supabase } from '../supabaseClient';
import ScrollShape3D from '../components/ScrollShape3D';
import { Helmet } from 'react-helmet-async';


const defaultCompanyInfo = {
    name: themeConfig.brandName,
    hero_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
    years_experience: '10',
    projects_completed: '500',
    happy_clients: '450',
    expert_team: '25'
};

const Home = () => {
    const [company, setCompany] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- NEW: Mobile Detection State ---
    const [isMobile, setIsMobile] = useState(false);

    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // --- NEW: Window Resize Listener ---
    useEffect(() => {
        const checkMobile = () => {
            // 768px is the standard threshold for tablets/mobile
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Check immediately on load
        window.addEventListener('resize', checkMobile); // Update if they resize the window

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: companyData } = await supabase.from('company').select('*').eq('id', 1).maybeSingle();
                if (companyData) setCompany(companyData);

                const { data: servicesData } = await supabase.from('services').select('*').eq('is_active', true).order('display_order', { ascending: true }).limit(4);
                if (servicesData) setServices(servicesData);

                const { data: reviewsData } = await supabase.from('testimonials').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(5);
                if (reviewsData) setReviews(reviewsData);
            } catch (error) {
                console.error("Unexpected error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const nextReview = () => setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    const prevReview = () => setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));

    useEffect(() => {
        // Don't set an interval if there are no reviews or only 1 review
        if (reviews.length <= 1) return;

        // Auto-scroll to the next review every 5 seconds (5000ms)
        const timer = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);

        // Cleanup function: This clears the timer when the component unmounts 
        // OR when the user clicks a button manually (resetting the clock).
        return () => clearInterval(timer);
    }, [reviews.length, currentReviewIndex]);

    const getIcon = (title: string) => {
        if (title.toLowerCase().includes('kitchen')) return <Sofa size={28} />;
        if (title.toLowerCase().includes('door')) return <DoorOpen size={28} />;
        if (title.toLowerCase().includes('bed')) return <BedDouble size={28} />;
        return <MonitorPlay size={28} />;
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-vortex-cream dark:bg-vortex-black">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Helmet>
            {/* The Title that shows up on the Google Search Page and browser tab */}
            <title>Vortex Infra | Premium Interior Design & Modular Kitchens in Ranchi</title>

            {/* The short description that shows up directly below the title on Google */}
            <meta
                name="description"
                content="Transform your space with Ranchi's top interior design, custom modular kitchens, and premium doors. Contact Vortex Infra today!"
            />
        <div className="w-full font-sans selection:bg-primary/30 bg-vortex-cream dark:bg-vortex-black transition-colors duration-300">
            
            
            
            {/* 1. THE 3D BACKGROUND (Layer 0) */}
            {!isMobile && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
                    <ScrollShape3D />
                </div>
            )}
            {/* ========================================== */}
            {/* 1. THE "BOXED CINEMATIC" HERO SECTION      */}
            {/* ========================================== */}
            <section className="w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative z-10">
                <div className="relative w-full h-[85vh] min-h-[600px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl group">

                    {/* The Hero Image with Slow Zoom Hover Effect */}
                    <img
                        src={company?.hero_image || defaultCompanyInfo.hero_image}
                        alt={company?.name || defaultCompanyInfo.name}
                        className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[3s] ease-out"
                    />

                    {/* The Smart Overlay: 
                        Top is mostly clear, bottom is a deep dark gradient. 
                        This guarantees white text is ALWAYS readable regardless of light/dark mode.
                    */}
                    <div className="absolute inset-0 bg-gradient-to-t from-vortex-black/95 via-vortex-black/40 to-transparent"></div>

                    {/* Floating Top Nav inside the Box */}
                    <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 hidden md:flex">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                            {company?.name || defaultCompanyInfo.name} Studio
                        </div>
                        <div className="flex gap-4 text-white text-xs font-bold uppercase tracking-widest">
                            <span className="drop-shadow-md">Architecture</span>
                            <span className="text-primary">•</span>
                            <span className="drop-shadow-md">Interiors</span>
                        </div>
                    </div>

                    {/* Bottom-Anchored Content Container */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-end gap-8 z-10">

                        {/* Huge Typography Side */}
                        <div className="max-w-3xl">
                            {company?.tagline ? (
                                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
                                    {company.tagline}
                                </h1>
                            ) : (
                                <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
                                    Spaces that <br className="hidden sm:block" />
                                    <span className="text-primary italic font-serif pr-2">Breathe</span> Life.
                                </h1>
                            )}
                            <p className="text-lg text-gray-300 font-light max-w-xl leading-relaxed drop-shadow-md mb-8">
                                We specialize in high-end residential and commercial transformations. Experience design that merges flawless utility with undeniable elegance.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/portfolio" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                                    View Our Masterpieces <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Right Side Interactive Play Button (Link to Portfolio/Contact) */}
                        <div className="hidden lg:block shrink-0">
                            <Link to="/contact" className="group flex items-center justify-center w-32 h-32 bg-white/10 hover:bg-white backdrop-blur-md rounded-full border border-white/20 hover:border-white transition-all duration-500 cursor-pointer">
                                <div className="text-white group-hover:text-vortex-charcoal flex flex-col items-center gap-2 transition-colors">
                                    <ArrowRight size={32} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Connect</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* ========================================== */}
            {/* 2. SERVICES: EDITORIAL GRID                */}
            {/* ========================================== */}
            <section className="py-24 bg-vortex-cream dark:bg-vortex-black transition-colors duration-300 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                        <div>
                            <h2 className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-primary"></span> Core Disciplines
                            </h2>
                            <h3 className="text-4xl md:text-5xl font-black text-vortex-charcoal dark:text-white tracking-tight">What We Do.</h3>
                        </div>
                        <Link
                            to="/services"
                            className="relative z-20 text-sm font-bold uppercase tracking-widest text-vortex-charcoal dark:text-white hover:text-primary dark:hover:text-primary flex items-center gap-2 pb-2 border-b-2 border-vortex-charcoal dark:border-white hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.length > 0 ? services.map((item, index) => (
                            <Link to={`/services`} key={item.id} className="group flex flex-col sm:flex-row bg-white dark:bg-vortex-dark rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 dark:border-vortex-charcoal transition-all duration-500">
                                <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                                    <div className="absolute inset-0 bg-vortex-charcoal/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="sm:w-3/5 p-8 flex flex-col justify-center relative">
                                    <div className="text-primary/20 absolute top-6 right-6 transform group-hover:rotate-12 group-hover:text-primary transition-all duration-500">
                                        {getIcon(item.title)}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">0{index + 1}</span>
                                    <h4 className="text-2xl font-bold text-vortex-charcoal dark:text-white mb-3">{item.title}</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                        {item.short_description}
                                    </p>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center text-gray-500 py-10 bg-white dark:bg-vortex-dark rounded-[2rem] border border-dashed border-gray-300 dark:border-vortex-charcoal">No services found. Add some in your Admin Dashboard.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* 3. TESTIMONIALS: THE FLOATING CARD         */}
            {/* ========================================== */}
            {reviews.length > 0 && (
                <section className="py-24 bg-white/20 dark:bg-vortex-dark/20 transition-colors duration-300 relative overflow-hidden ">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="bg-vortex-charcoal dark:bg-vortex-black rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">

                            {/* Abstract Graphic inside box */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>

                            <div className="lg:w-1/3 relative z-10">
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">Client<br /><span className="text-primary">Experiences.</span></h2>
                                <div className="flex gap-3">
                                    <button onClick={prevReview} className="p-4 rounded-full bg-white/10 text-white hover:bg-primary transition-all backdrop-blur-md">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextReview} className="p-4 rounded-full bg-white/10 text-white hover:bg-primary transition-all backdrop-blur-md">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="lg:w-2/3 relative z-10 w-full">
                                <div className="flex gap-1 text-primary mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < (reviews[currentReviewIndex].rating || 5) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-2xl md:text-3xl font-light text-white mb-10 leading-relaxed font-serif italic">
                                    "{reviews[currentReviewIndex].review || reviews[currentReviewIndex].comment}"
                                </p>
                                <div className="flex items-center gap-5">
                                    {reviews[currentReviewIndex].image_url ? (
                                        <img src={reviews[currentReviewIndex].image_url} alt={reviews[currentReviewIndex].customer_name} className="w-16 h-16 rounded-full object-cover border border-white/20" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                            {reviews[currentReviewIndex].customer_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-white tracking-wide">{reviews[currentReviewIndex].customer_name}</h4>
                                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Verified Client</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* 4. STATS BANNER                            */}
            {/* ========================================== */}
            <section className="py-24 bg-vortex-cream/20 dark:bg-vortex-black/20 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-y border-gray-300 dark:border-slate-800 py-16">

                        <div className="text-center md:border-r border-gray-300 dark:border-slate-800">
                            <div className="text-5xl md:text-6xl font-black text-primary mb-3">
                                {company?.years_experience || defaultCompanyInfo.years_experience}<span className="text-vortex-charcoal dark:text-white text-4xl">+</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Years Experience</div>
                        </div>

                        <div className="text-center md:border-r border-gray-300 dark:border-slate-800">
                            <div className="text-5xl md:text-6xl font-black text-primary mb-3">
                                {company?.projects_completed || defaultCompanyInfo.projects_completed}<span className="text-vortex-charcoal dark:text-white text-4xl">+</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Projects Built</div>
                        </div>

                        <div className="text-center md:border-r border-gray-300 dark:border-slate-800">
                            <div className="text-5xl md:text-6xl font-black text-primary mb-3">
                                {company?.happy_clients || defaultCompanyInfo.happy_clients}<span className="text-vortex-charcoal dark:text-white text-4xl">+</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Happy Clients</div>
                        </div>

                        <div className="text-center">
                            <div className="text-5xl md:text-6xl font-black text-primary mb-3">
                                {defaultCompanyInfo.expert_team}<span className="text-vortex-charcoal dark:text-white text-4xl">+</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Studio Experts</div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
        </Helmet>
    );
};

export default Home;