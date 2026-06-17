import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2, MapPin, X, ArrowUpRight, Play } from 'lucide-react';

const Portfolio = () => {
    const [pins, setPins] = useState<any[]>([]);
    const [filteredPins, setFilteredPins] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    // Pinterest-style Modal State
    const [activePin, setActivePin] = useState<any | null>(null);
    const detailsScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPinterestData = async () => {
            const { data } = await supabase
                .from('portfolio')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                let allPins: any[] = [];

                // FLATTEN THE DATA: Extract every single media item into its own "Pin"
                data.forEach(project => {
                    // Add Video Pin
                    if (project.video_url) {
                        allPins.push({ type: 'video', url: project.video_url, project });
                    }
                    // Add Thumbnail Pin
                    if (project.thumbnail_url) {
                        allPins.push({ type: 'image', url: project.thumbnail_url, project });
                    }
                    // Add all Gallery Images as individual Pins
                    if (Array.isArray(project.gallery_images)) {
                        project.gallery_images.forEach((img: string) => {
                            allPins.push({ type: 'image', url: img, project });
                        });
                    }
                });

                setPins(allPins);
                setFilteredPins(allPins);

                const uniqueCats = ['All', ...Array.from(new Set(data.map((p: any) => p.category)))];
                setCategories(uniqueCats);
            }
            setIsLoading(false);
        };
        fetchPinterestData();
    }, []);

    const handleFilter = (category: string) => {
        setActiveFilter(category);
        if (category === 'All') {
            setFilteredPins(pins);
        } else {
            setFilteredPins(pins.filter(pin => pin.project.category === category));
        }
    };

    const openPin = (pin: any) => {
        setActivePin(pin);
        document.body.style.overflow = 'hidden';
        // Scroll details panel back to top when a new pin is opened
        if (detailsScrollRef.current) {
            detailsScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const closePin = () => {
        setActivePin(null);
        document.body.style.overflow = 'auto';
    };

    // Dynamically find related pins based on category (excluding the currently active one)
    const relatedPins = activePin
        ? pins.filter(p => p.project.category === activePin.project.category && p.url !== activePin.url).slice(0, 6)
        : [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-20 transition-colors duration-300">

            {/* Pinterest-Style Header & Filter Pills */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                    Inspiration Board
                </h1>

                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleFilter(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeFilter === cat
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* THE PINTEREST MASONRY GRID */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                    {filteredPins.map((pin, index) => (
                        <div
                            key={index}
                            onClick={() => openPin(pin)}
                            className="break-inside-avoid relative group mb-4 rounded-2xl overflow-hidden cursor-zoom-in bg-gray-100 dark:bg-gray-900"
                        >
                            {/* Media */}
                            {pin.type === 'video' ? (
                                <video src={pin.url} autoPlay loop muted playsInline className="w-full h-auto block" />
                            ) : (
                                <img src={pin.url} alt={pin.project.title} loading="lazy" className="w-full h-auto block" />
                            )}

                            {/* Video Play Icon Overlay */}
                            {pin.type === 'video' && (
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white">
                                    <Play size={14} fill="currentColor" />
                                </div>
                            )}

                            {/* Pinterest Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
                                <div className="flex justify-end">
                                    <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                                        View
                                    </span>
                                </div>
                                <div className="transform translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                                        {pin.project.title}
                                    </h3>
                                    <p className="text-gray-200 text-xs font-medium mt-1 truncate">
                                        {pin.project.category}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PINTEREST-STYLE SPLIT SCREEN MODAL */}
            {activePin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">

                    {/* Background Clickable Area to Close */}
                    <div className="absolute inset-0" onClick={closePin}></div>

                    {/* Modal Container */}
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-in zoom-in-95 duration-200">

                        {/* Left Side: The Media (Takes up 50-60% of space) */}
                        <div className="w-full md:w-[55%] bg-gray-50 dark:bg-black flex items-center justify-center p-4">
                            {activePin.type === 'video' ? (
                                <video key={activePin.url} src={activePin.url} controls autoPlay loop className="max-w-full max-h-[85vh] rounded-xl shadow-lg" />
                            ) : (
                                <img key={activePin.url} src={activePin.url} alt={activePin.project.title} className="max-w-full max-h-[85vh] rounded-xl shadow-lg object-contain" />
                            )}
                        </div>

                        {/* Right Side: Project Details & Related Pins */}
                        <div ref={detailsScrollRef} className="w-full md:w-[45%] p-8 md:p-10 flex flex-col h-full overflow-y-auto">

                            {/* Close Button & Action Bar */}
                            <div className="flex justify-between items-center mb-8">
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {activePin.project.category}
                                </span>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <ArrowUpRight size={20} />
                                    </button>
                                    <button onClick={closePin} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Project Title & Info */}
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                {activePin.project.title}
                            </h2>

                            {activePin.project.location && (
                                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium mb-6">
                                    <MapPin size={16} className="text-red-500" /> {activePin.project.location}
                                </p>
                            )}

                            {/* Description */}
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {activePin.project.description}
                                </p>
                            </div>

                            {/* Mock Uploader Profile */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-black text-lg">
                                        V
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">Vortex Infra</p>
                                        <p className="text-xs text-gray-500">Interior Architects</p>
                                    </div>
                                </div>
                                <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                    Contact Us
                                </button>
                            </div>

                            {/* NEW: Related Pins Section ("More like this") */}
                            {relatedPins.length > 0 && (
                                <div className="mt-auto pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                                        More like this
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {relatedPins.map((relPin, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => openPin(relPin)}
                                                className="aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 dark:bg-gray-800 relative"
                                            >
                                                {relPin.type === 'video' ? (
                                                    <video src={relPin.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <img src={relPin.url} alt="Related project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                )}

                                                {relPin.type === 'video' && (
                                                    <div className="absolute top-2 left-2 bg-black/50 p-1.5 rounded-full text-white">
                                                        <Play size={10} fill="currentColor" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;