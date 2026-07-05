import React, { useEffect, useState } from 'react';
import { Target, Eye, Users } from 'lucide-react';
import { themeConfig } from '../config/theme';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

const defaultCompanyInfo = {
    name: themeConfig.brandName,
    about_short: "We are a premier interior design and construction management firm dedicated to transforming spaces into luxurious, functional works of art. With years of expertise, we bring architectural visions to life.",
    mission: "To deliver exceptional interior design and construction services that exceed client expectations through innovation, quality craftsmanship, and unwavering attention to detail.",
    vision: "To be the globally recognized standard for luxury interior infrastructure, inspiring better living and working environments through sustainable and cutting-edge design."
};

const About = () => {
    const [company, setCompany] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: companyData, error: companyError } = await supabase
                    .from('company')
                    .select('*')
                    .eq('id', 1)
                    .maybeSingle();

                if (companyError) console.error("Company fetch error:", companyError);
                if (companyData) setCompany(companyData);

                const { data: teamData, error: teamError } = await supabase
                    .from('team')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (teamError) console.error("Team fetch error:", teamError);
                if (teamData) setTeam(teamData);

                const { data: storiesData, error: storiesError } = await supabase
                    .from('stories')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (storiesError) console.error("Stories fetch error:", storiesError);
                if (storiesData) setStories(storiesData);

            } catch (error) {
                console.error("Unexpected error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <> 
        <Helmet>
                <title>About Vortex Infra | Top Infrastructure & Design Team in Ranchi</title>
                <meta
                    name="description"
                    content="Discover the story behind Vortex Infra. We deliver premium interior design, structural engineering, and home renovation services across Ranchi, Jharkhand."
                />
            </Helmet> 
        <div className="w-full bg-white dark:bg-slate-950">

            

            {/* 1. ORIGINAL HERO SECTION */}
            <section className="relative pt-40 pb-20 flex items-center justify-center bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase mb-4 block">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                        About <span className="text-primary">{company?.name || defaultCompanyInfo.name}</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {company?.about_short || defaultCompanyInfo.about_short}
                    </p>
                </div>
            </section>

            {/* 2. ORIGINAL MISSION & VISION SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-gray-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                            <Target size={32} />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 dark:text-white">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            {company?.mission || defaultCompanyInfo.mission}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-gray-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 dark:text-white">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            {company?.vision || defaultCompanyInfo.vision}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. MINIMAL STORY FEED SECTION (Centered Layout) */}
            {stories.length > 0 && (
                <section className="py-24 bg-gray-50 dark:bg-slate-900">
                    <div className="px-6 md:px-12 max-w-5xl mx-auto">

                        {/* Centered Section Header */}
                        <div className="text-center mb-20">
                            <h2 className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-4">Evolution</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                                Our Legacy.
                            </h3>
                        </div>

                        {/* Story Feed */}
                        <div className="space-y-24 md:space-y-32">
                            {stories.map((story, index) => (
                                <div key={story.id} className="group flex flex-col w-full">

                                    {/* Minimalist Image */}
                                    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-white dark:bg-slate-800 rounded-[1rem] overflow-hidden mb-8 shadow-sm">
                                        {story.image_url ? (
                                            <img
                                                src={story.image_url}
                                                alt={story.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out grayscale hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="tracking-widest uppercase text-xs">Image Placeholder</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Elegant Typography */}
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                                        <div className="text-primary font-serif italic text-3xl md:text-5xl shrink-0">
                                            0{index + 1}.
                                        </div>
                                        <div className="w-full">
                                            <h4 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 dark:text-white">
                                                {story.title}
                                            </h4>
                                            {/* Correct DB field rendering */}
                                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap max-w-full">
                                                {story.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </section>
            )}

            {/* 4. ORIGINAL REVERSE 3D FLIP CARD TEAM SECTION */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Our People</h2>
                    <h3 className="text-4xl md:text-5xl font-black dark:text-white mb-4">Meet The Experts</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Hover over our team members to reveal their full profile image.
                    </p>
                </div>

                {team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member) => (
                            <div key={member.id} className="group w-full h-[400px] [perspective:1200px] cursor-pointer max-w-[320px] mx-auto">

                                {/* Inner Card - Bouncy Flip Animation */}
                                <div className="relative w-full h-full rounded-2xl transition-transform duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg hover:shadow-2xl will-change-transform">

                                    {/* FRONT OF CARD: Clean Info Plate, Bio & Experience (Default View) */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl bg-amber-100 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex flex-col items-center pt-8 pb-6 px-6">

                                        {/* Circular Avatar */}
                                        <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border-4 border-primary mb-4 shadow-md bg-white">
                                            {member.image_url ? (
                                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                                                    <Users size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Name */}
                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight text-center">
                                            {member.name}
                                        </h4>

                                        {/* Role / Designation */}
                                        <p className="text-sm text-primary font-bold uppercase tracking-widest px-2 mb-3 text-center">
                                            {member.role || member.post || member.designation || 'Team Member'}
                                        </p>

                                        {/* Small Font Experience Pill */}
                                        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                                            {member.experience || '5+ Years Experience'}
                                        </div>

                                        {/* Bio */}
                                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center leading-relaxed line-clamp-4">
                                            {member.bio || "Bringing exceptional architectural visions to life."}
                                        </p>

                                    </div>

                                    {/* BACK OF CARD: Full Image Only (Reveals on Hover) */}
                                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden border-[6px] border-white dark:border-slate-800 bg-gray-200">
                                        {member.image_url ? (
                                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-600">
                                                <Users size={64} />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-slate-900 rounded-3xl shadow-inner border border-gray-100 dark:border-slate-800">
                        Team profiles will appear here once added in the Admin Dashboard.
                    </div>
                )}
            </section>
        </div>
        </>
    );
};

export default About;