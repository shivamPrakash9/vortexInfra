import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

// Reusing your custom Brand Icons for the Footer
const Instagram = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const Facebook = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const Youtube = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
const Linkedin = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const Footer = () => {
    const [company, setCompany] = useState<any>({});

    useEffect(() => {
        const fetchCompany = async () => {
            const { data } = await supabase.from('company').select('*').eq('id', 1).single();
            if (data) setCompany(data);
        };
        fetchCompany();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900 relative z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">

                {/* Top Grid Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            {company.logo ? (
                                <img src={company.logo} alt="Vortex Infra Logo" className="h-10 w-auto object-contain bg-white rounded p-1" />
                            ) : (
                                <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-black text-white text-xl">V</div>
                            )}
                            <h2 className="text-2xl font-black text-white tracking-tight">Vortex Infra</h2>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {company.about_short || "Elevating spaces with premium interior architecture and bespoke construction management. Your vision, expertly executed."}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-slate-400 hover:text-primary hover:translate-x-1 inline-flex items-center transition-all text-sm font-medium"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{company.phone || "Loading..."}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="text-primary shrink-0 mt-0.5" />
                                <span className="text-sm font-medium">{company.email || "Loading..."}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                                <span className="text-sm font-medium leading-relaxed">{company.address || "Loading..."}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Socials & CTA */}
                    <div>
                        <h4 className="text-white font-bold tracking-widest uppercase text-xs mb-6">Connect</h4>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {company.instagram_url && (
                                <a href={company.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                            {company.facebook_url && (
                                <a href={company.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {company.youtube_url && (
                                <a href={company.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Youtube size={16} />
                                </a>
                            )}
                            {company.linkedin_url && (
                                <a href={company.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <Linkedin size={16} />
                                </a>
                            )}
                        </div>

                        <Link to="/contact" className="group inline-flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-primary border border-slate-800 hover:border-primary px-5 py-3 rounded-xl transition-all">
                            Start a Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        &copy; {currentYear} Vortex Infra. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs font-medium text-slate-500">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;