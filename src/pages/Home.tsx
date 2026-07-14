import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sofa, DoorOpen, BedDouble, MonitorPlay, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
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

const faqs = [
    {
        question: "Why hire an interior designer in Ranchi?",
        answer: "Hiring a professional interior designer in Ranchi ensures your space is optimized for both aesthetics and functionality. We understand local architecture, climate, and material availability, providing you with cost-effective, custom designs that elevate your lifestyle or business."
    },
    {
        question: "What is the cost of modular kitchen design in Ranchi?",
        answer: "The cost of a modular kitchen in Ranchi varies based on layout, materials (like acrylic, laminate, or PU finishes), and hardware. We offer customized modular kitchen designs that fit a wide range of budgets without compromising on durability or style."
    },
    {
        question: "Do you provide turnkey interior solutions in Ranchi?",
        answer: "Yes! As a leading interior company in Jharkhand, we provide complete end-to-end turnkey interior solutions. From conceptualization and 3D rendering to material procurement and final execution, we handle everything."
    },
    {
        question: "Do you provide custom furniture and sofa design in Ranchi?",
        answer: "Absolutely. Our expert furniture designers and sofa makers in Ranchi craft bespoke pieces tailored exactly to your space, ensuring perfect fit, comfort, and exclusive aesthetics."
    },
    {
        question: "Do you design offices and commercial spaces?",
        answer: "Yes, we are top-rated office interior designers in Ranchi. We create highly productive, brand-aligned commercial spaces, including retail outlets, corporate offices, and hospitality venues."
    },
    {
        question: "Do you provide door and window design services?",
        answer: "Yes, we specialize in premium door and window design in Ranchi, offering custom wooden, UPVC, and aluminum solutions that enhance both security and interior beauty."
    }
];

const Home = () => {
    const [company, setCompany] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
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
        if (reviews.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [reviews.length, currentReviewIndex]);

    const getIcon = (title: string) => {
        if (title.toLowerCase().includes('kitchen')) return <Sofa size={28} aria-hidden="true" />;
        if (title.toLowerCase().includes('door')) return <DoorOpen size={28} aria-hidden="true" />;
        if (title.toLowerCase().includes('bed')) return <BedDouble size={28} aria-hidden="true" />;
        return <MonitorPlay size={28} aria-hidden="true" />;
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-vortex-cream dark:bg-vortex-black" role="status" aria-label="Loading content">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // --- JSON-LD SCHEMAS ---
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": ["InteriorDesign", "LocalBusiness"],
        "name": company?.name || defaultCompanyInfo.name,
        "image": company?.hero_image || defaultCompanyInfo.hero_image,
        "description": "Top-rated Interior Designer in Ranchi, Jharkhand. We offer modular kitchen designs, home & office interiors, custom furniture, sofa, and door designs.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Ranchi",
            "addressRegion": "Jharkhand",
            "addressCountry": "IN"
        },
        "telephone": company?.phone || "",
        "url": typeof window !== 'undefined' ? window.location.origin : "https://vortexinfra.com",
        "priceRange": "$$"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <Helmet>
                <title>{company?.name || defaultCompanyInfo.name} | Best Interior Designer & Modular Kitchens in Ranchi</title>
                <meta name="description" content="Looking for the best interior designer in Ranchi? We specialize in modular kitchens, home/office interiors, turnkey solutions, custom furniture & door designs in Jharkhand." />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : "https://vortexinfra.com"} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={`${company?.name || defaultCompanyInfo.name} | Interior Designer Ranchi`} />
                <meta property="og:description" content="Expert modular kitchen designers and turnkey home interior solutions in Ranchi, Jharkhand. Book a consultation today." />
                <meta property="og:image" content={company?.hero_image || defaultCompanyInfo.hero_image} />
                <meta property="og:type" content="website" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Best Interior Designer in Ranchi" />
                <meta name="twitter:description" content="Expert modular kitchen designers and turnkey home interior solutions in Ranchi." />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(localBusinessSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            {/* Semantic <main> tag replaces the generic div */}
            <main className="w-full font-sans selection:bg-primary/30 bg-vortex-cream dark:bg-vortex-black transition-colors duration-300">

                {/* THE 3D BACKGROUND */}
                {!isMobile && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} aria-hidden="true">
                        <ScrollShape3D />
                    </div>
                )}

                {/* ========================================== */}
                {/* 1. HERO SECTION                            */}
                {/* ========================================== */}
                <section className="w-full px-4 sm:px-6 lg:px-8 pt-28 pb-12 relative z-10" aria-label="Hero Section">
                    <div className="relative w-full h-[85vh] min-h-[600px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl group">
                        <img
                            src={company?.hero_image || defaultCompanyInfo.hero_image}
                            alt={`${company?.name || defaultCompanyInfo.name} - Luxury Interior Design Projects in Ranchi`}
                            className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[3s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-vortex-black/95 via-vortex-black/40 to-transparent"></div>

                        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 hidden md:flex">
                            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                                {company?.name || defaultCompanyInfo.name} Ranchi
                            </div>
                            <div className="flex gap-4 text-white text-xs font-bold uppercase tracking-widest">
                                <span className="drop-shadow-md">Architecture</span>
                                <span className="text-primary">•</span>
                                <span className="drop-shadow-md">Turnkey Interiors</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-end gap-8 z-10">
                            <div className="max-w-3xl">
                                {/* SEO Optimized H1 with visual styling retained */}
                                {company?.tagline ? (
                                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
                                        {company.tagline}
                                    </h1>
                                ) : (
                                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
                                        Ranchi's Premier <br className="hidden sm:block" />
                                        <span className="text-primary italic font-serif pr-2">Interior</span> Studio.
                                    </h1>
                                )}

                                {/* SEO Optimized Paragraph */}
                                <p className="text-lg text-gray-300 font-light max-w-xl leading-relaxed drop-shadow-md mb-8">
                                    As the leading interior company in Jharkhand, we specialize in high-end home and office interiors. From bespoke modular kitchens and custom sofa designs to premium door and window creations, experience end-to-end execution that merges flawless utility with undeniable elegance.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Link to="/portfolio" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                                        View Our Masterpieces <ArrowRight size={18} aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>

                            <div className="hidden lg:block shrink-0">
                                <Link to="/contact" aria-label="Connect with our interior designers" className="group flex items-center justify-center w-32 h-32 bg-white/10 hover:bg-white backdrop-blur-md rounded-full border border-white/20 hover:border-white transition-all duration-500 cursor-pointer">
                                    <div className="text-white group-hover:text-vortex-charcoal flex flex-col items-center gap-2 transition-colors">
                                        <ArrowRight size={32} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" aria-hidden="true" />
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
                <section className="py-24 bg-vortex-cream dark:bg-vortex-black transition-colors duration-300 relative z-10" aria-labelledby="services-heading">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                            <div>
                                <h2 className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                                    <span className="w-8 h-[2px] bg-primary"></span> Core Disciplines
                                </h2>
                                <h3 id="services-heading" className="text-4xl md:text-5xl font-black text-vortex-charcoal dark:text-white tracking-tight">Our Interior Design Services.</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl text-lg">
                                    Providing expertly crafted interior solutions across Ranchi. We deliver tailored designs, quality materials, and on-time execution.
                                </p>
                            </div>
                            <Link
                                to="/services"
                                className="relative z-20 text-sm font-bold uppercase tracking-widest text-vortex-charcoal dark:text-white hover:text-primary dark:hover:text-primary flex items-center gap-2 pb-2 border-b-2 border-vortex-charcoal dark:border-white hover:border-primary dark:hover:border-primary transition-all cursor-pointer"
                                aria-label="View all interior design services"
                            >
                                View All <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.length > 0 ? services.map((item, index) => (
                                /* Changed to <article> for better semantic structure */
                                <article key={item.id} className="group flex flex-col sm:flex-row bg-white dark:bg-vortex-dark rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 dark:border-vortex-charcoal transition-all duration-500">
                                    <Link to={`/services`} className="flex flex-col sm:flex-row w-full h-full" aria-label={`Learn more about ${item.title}`}>
                                        <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                                            <div className="absolute inset-0 bg-vortex-charcoal/20 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img src={item.image_url} alt={`${item.title} Designer in Ranchi`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="sm:w-3/5 p-8 flex flex-col justify-center relative">
                                            <div className="text-primary/20 absolute top-6 right-6 transform group-hover:rotate-12 group-hover:text-primary transition-all duration-500">
                                                {getIcon(item.title)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">0{index + 1}</span>
                                            {/* Used H4 naturally as requested, maintaining CSS class structure */}
                                            <h4 className="text-2xl font-bold text-vortex-charcoal dark:text-white mb-3">{item.title}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                                {item.short_description}
                                            </p>
                                        </div>
                                    </Link>
                                </article>
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
                    <section className="py-24 bg-white/20 dark:bg-vortex-dark/20 transition-colors duration-300 relative overflow-hidden" aria-labelledby="testimonials-heading">
                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            <div className="bg-vortex-charcoal dark:bg-vortex-black rounded-[3rem] p-8 md:p-16 shadow-2xl flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>

                                <div className="lg:w-1/3 relative z-10">
                                    <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">Client<br /><span className="text-primary">Experiences.</span></h2>
                                    <p className="text-gray-400 text-sm mb-6 max-w-xs">Hear from our satisfied clients across Ranchi & Jharkhand.</p>
                                    <div className="flex gap-3">
                                        <button onClick={prevReview} aria-label="Previous Review" className="p-4 rounded-full bg-white/10 text-white hover:bg-primary transition-all backdrop-blur-md">
                                            <ChevronLeft size={20} aria-hidden="true" />
                                        </button>
                                        <button onClick={nextReview} aria-label="Next Review" className="p-4 rounded-full bg-white/10 text-white hover:bg-primary transition-all backdrop-blur-md">
                                            <ChevronRight size={20} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:w-2/3 relative z-10 w-full" aria-live="polite">
                                    <div className="flex gap-1 text-primary mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={20} fill={i < (reviews[currentReviewIndex].rating || 5) ? "currentColor" : "none"} aria-hidden="true" />
                                        ))}
                                    </div>
                                    <blockquote className="text-2xl md:text-3xl font-light text-white mb-10 leading-relaxed font-serif italic">
                                        "{reviews[currentReviewIndex].review || reviews[currentReviewIndex].comment}"
                                    </blockquote>
                                    <div className="flex items-center gap-5">
                                        {reviews[currentReviewIndex].image_url ? (
                                            <img src={reviews[currentReviewIndex].image_url} alt={`Review from ${reviews[currentReviewIndex].customer_name}`} className="w-16 h-16 rounded-full object-cover border border-white/20" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-black text-2xl shadow-lg" aria-hidden="true">
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
                {/* NEW: FAQ SECTION (SEO & CRO Booster)       */}
                {/* ========================================== */}
                <section className="py-24 bg-vortex-cream dark:bg-vortex-black transition-colors duration-300 relative z-10" aria-labelledby="faq-heading">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-4">Answers & Insights</h2>
                            <h3 id="faq-heading" className="text-4xl md:text-5xl font-black text-vortex-charcoal dark:text-white tracking-tight">Frequently Asked Questions.</h3>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                /* Native details/summary elements are highly accessible and excellent for SEO snippets */
                                <details key={index} className="group bg-white dark:bg-vortex-dark rounded-2xl border border-gray-100 dark:border-vortex-charcoal shadow-sm hover:shadow-md transition-shadow">
                                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-lg font-bold text-vortex-charcoal dark:text-white marker:content-none">
                                        {faq.question}
                                        <span className="relative flex shrink-0 items-center justify-center rounded-full bg-primary/10 p-2 text-primary group-open:bg-primary group-open:text-white transition-colors">
                                            <Plus size={20} className="block group-open:hidden" />
                                            <Minus size={20} className="hidden group-open:block" />
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-vortex-black pt-4">
                                        <p>{faq.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================== */}
                {/* 4. STATS BANNER                            */}
                {/* ========================================== */}
                <section className="py-24 bg-vortex-cream/20 dark:bg-vortex-black/20 relative z-20" aria-label="Company Statistics">
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

            </main>
        </>
    );
};

export default Home;