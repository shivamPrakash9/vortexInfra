import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, ArrowRight, Diamond, Sparkles, Image as ImageIcon } from 'lucide-react';

const Services = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (!error && data) setServices(data);
            setLoading(false);
        };
        fetchServices();
    }, []);

    return (
        <div className="relative min-h-screen pt-32 pb-32 bg-slate-50 dark:bg-[#080B12] transition-colors overflow-hidden">

            {/* --- LUXURY ANIMATED AMBIENT BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Gold Glow */}
                <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60 mix-blend-multiply dark:mix-blend-lighten animate-[pulse_6s_ease-in-out_infinite]"></div>
                {/* Indigo Glow */}
                <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-[150px] opacity-70 mix-blend-multiply dark:mix-blend-lighten animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
                {/* Rose Glow */}
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-rose-500/15 dark:bg-rose-900/20 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-lighten animate-[pulse_7s_ease-in-out_infinite]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* --- ELEGANT HEADER --- */}
                <div className="text-center mb-28 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-6 opacity-90">
                        <div className="h-[1px] w-12 bg-primary"></div>
                        <Sparkles className="text-primary" size={14} />
                        <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">The Collection</span>
                        <Sparkles className="text-primary" size={14} />
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
                        Bespoke <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary">Interiors</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                        Curated design and construction services, seamlessly blending timeless aesthetics with unparalleled functionality.
                    </p>
                </div>

                {/* --- OFFSET GLASSMORPHISM LAYOUT --- */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : services.length > 0 ? (
                    <div className="space-y-32 md:space-y-48">
                        {services.map((service, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={service.id} className="relative w-full flex flex-col md:flex-row items-center group">

                                    {/* 1. LARGE CINEMATIC IMAGE */}
                                    <div className={`relative w-full md:w-8/12 h-[450px] md:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-300/50 dark:shadow-black/60 z-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                                        {service.image_url ? (
                                            <img
                                                src={service.image_url}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s] ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                                                <ImageIcon size={64} strokeWidth={1} />
                                            </div>
                                        )}
                                        {/* Cinematic Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                                    </div>

                                    {/* 2. FLOATING FROSTED GLASS PANEL */}
                                    <div className={`w-[90%] md:w-5/12 z-10 -mt-24 md:mt-0 ${isEven ? 'md:order-2 md:-ml-32' : 'md:order-1 md:-mr-32'} relative`}>

                                        {/* Glowing Aura behind the glass card that intensifies on hover */}
                                        <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]"></div>

                                        <div className="relative bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl backdrop-saturate-150 p-8 md:p-12 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">

                                            {/* Price Tag (VISIBLE) */}
                                            {(service.pricing || service.price_display) && (
                                                <div className="inline-block bg-primary/10 border border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full mb-6">
                                                    {service.pricing || service.price_display}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-snug drop-shadow-sm">
                                                {service.title}
                                            </h2>

                                            {/* Description */}
                                            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-light">
                                                {service.short_description || service.description}
                                            </p>

                                            {/* Features List (VISIBLE & PREMIUM) */}
                                            {service.features && service.features.length > 0 && (
                                                <div className="flex flex-col gap-4 mb-10 p-6 bg-white/30 dark:bg-black/20 rounded-2xl border border-white/40 dark:border-white/5">
                                                    {service.features.slice(0, 4).map((feature: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            <div className="p-1 rounded-full bg-primary/20">
                                                                <Diamond className="text-primary fill-primary" size={10} />
                                                            </div>
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                    {service.features.length > 4 && (
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 italic ml-8">
                                                            + {service.features.length - 4} bespoke features
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Luxury CTA Line */}
                                            <Link
                                                to={`/contact?service=${encodeURIComponent(service.title)}`}
                                                className="group/cta flex items-center gap-4 w-fit cursor-pointer mt-auto"
                                            >
                                                <span className="text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs group-hover/cta:text-primary transition-colors">
                                                    Consult With Us
                                                </span>
                                                <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-600 group-hover/cta:w-20 group-hover/cta:bg-primary transition-all duration-500 ease-out relative flex items-center justify-end">
                                                    <ArrowRight size={14} className="text-primary absolute -right-1 opacity-0 group-hover/cta:opacity-100 group-hover/cta:translate-x-2 transition-all duration-500 delay-100" />
                                                </div>
                                            </Link>

                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 backdrop-blur-2xl bg-white/30 dark:bg-slate-900/30 rounded-[3rem] border border-white/40 dark:border-white/5 shadow-2xl max-w-3xl mx-auto">
                        <p className="text-gray-600 dark:text-gray-400 font-light text-lg">Curated collections are currently being updated.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Services;