import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Contact = () => {
    const [searchParams] = useSearchParams();
    const urlService = searchParams.get('service') || '';

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: urlService,
        message: ''
    });

    // Submission & Company Data State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [companyInfo, setCompanyInfo] = useState<any>(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(true);

    // 1. Fetch Company Info from Database
    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const { data, error } = await supabase
                    .from('company')
                    .select('*')
                    .eq('id', 1)
                    .maybeSingle();

                if (!error && data) {
                    setCompanyInfo(data);
                }
            } catch (err) {
                console.error('Error fetching company info:', err);
            } finally {
                setIsLoadingInfo(false);
            }
        };
        fetchCompanyInfo();
    }, []);

    // 2. Automatically update the service field if the URL changes
    useEffect(() => {
        if (urlService) {
            setFormData(prev => ({ ...prev, service: urlService }));
        }
    }, [urlService]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Handle Submission: Save to DB & Redirect to WhatsApp
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Save inquiry to the contact_messages table
            const { error } = await supabase.from('contact_messages').insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    service_interest: formData.service,
                    message: formData.message,
                }
            ]);

            if (error) throw error;

            // WhatsApp Redirect Logic
            if (companyInfo?.whatsapp || companyInfo?.phone) {
                const rawPhone = companyInfo.whatsapp || companyInfo.phone;
                const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

                const waMessage = `*New Website Inquiry* 🚀\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Service:* ${formData.service}\n\n*Message:*\n${formData.message}`;
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

                window.open(waUrl, '_blank');
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen pt-32 pb-32 bg-slate-50 dark:bg-[#080B12] transition-colors overflow-hidden">

            {/* --- LUXURY ANIMATED AMBIENT BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-60 mix-blend-multiply dark:mix-blend-lighten animate-[pulse_6s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-indigo-500/15 dark:bg-indigo-600/15 rounded-full blur-[150px] opacity-70 mix-blend-multiply dark:mix-blend-lighten animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* --- ELEGANT HEADER --- */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-6 opacity-90">
                        <div className="h-[1px] w-12 bg-primary"></div>
                        <Sparkles className="text-primary" size={14} />
                        <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs">Let's Talk</span>
                        <Sparkles className="text-primary" size={14} />
                        <div className="h-[1px] w-12 bg-primary"></div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm">
                        Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-primary">Vision</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                        Reach out to our architectural and interior design experts to begin transforming your space.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

                    {/* LEFT COLUMN: Contact Information & Google Maps */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-xl">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Studio Information</h3>

                            {isLoadingInfo ? (
                                <div className="flex items-center justify-center py-10">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {companyInfo?.address && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Headquarters</h4>
                                                <p className="text-gray-600 dark:text-gray-400 font-light whitespace-pre-line">{companyInfo.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {companyInfo?.phone && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                                                <Phone size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Phone</h4>
                                                <p className="text-gray-600 dark:text-gray-400 font-light">{companyInfo.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {companyInfo?.email && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
                                                <Mail size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Email</h4>
                                                <p className="text-gray-600 dark:text-gray-400 font-light">{companyInfo.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Dynamic Social Media Links with Inline SVGs */}
                            {!isLoadingInfo && (companyInfo?.facebook_url || companyInfo?.instagram_url || companyInfo?.linkedin_url || companyInfo?.youtube_url) && (
                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Connect With Us</h4>
                                    <div className="flex items-center gap-3">
                                        {companyInfo?.instagram_url && (
                                            <a href={companyInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                                </svg>
                                            </a>
                                        )}
                                        {companyInfo?.facebook_url && (
                                            <a href={companyInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                                </svg>
                                            </a>
                                        )}
                                        {companyInfo?.linkedin_url && (
                                            <a href={companyInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                    <rect x="2" y="9" width="4" height="12"></rect>
                                                    <circle cx="4" cy="4" r="2"></circle>
                                                </svg>
                                            </a>
                                        )}
                                        {companyInfo?.youtube_url && (
                                            <a href={companyInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Google Maps Embed */}
                            {!isLoadingInfo && companyInfo?.google_map_embed_url && (
                                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 h-64 relative group">
                                    <iframe
                                        src={companyInfo.google_map_embed_url}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Glassmorphic Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/60 dark:bg-slate-900/50 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden">

                            {/* Form glowing aura */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

                            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Service of Interest</label>
                                        <input
                                            type="text"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all placeholder-gray-400"
                                            placeholder="e.g. Kitchen Renovation"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Project Details</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white transition-all placeholder-gray-400 resize-none"
                                        placeholder="Tell us about your vision, timeline, and space..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative overflow-hidden bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-5 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-xl mt-4 w-full md:w-auto md:self-end disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2">
                                                Submit Inquiry
                                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                            </span>
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-900 flex items-center justify-center gap-2 font-bold">
                                                Submit Inquiry
                                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                            </span>
                                        </>
                                    )}
                                </button>

                                {/* Success/Error Messages */}
                                {submitStatus === 'success' && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-4">
                                        Thank you! Your inquiry has been saved and sent to WhatsApp.
                                    </div>
                                )}
                                {submitStatus === 'error' && (
                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-4">
                                        Something went wrong. Please try again or contact us directly.
                                    </div>
                                )}
                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;