import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- Custom Brand Icons ---
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

const Contact = () => {
    const [isSending, setIsSending] = useState(false);

    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        google_map_embed_url: '',
        facebook_url: '',
        instagram_url: '',
        youtube_url: '',
        linkedin_url: ''
    });

    // Honeypot State (for spam prevention)
    const [botTrap, setBotTrap] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service: 'Kitchen Design',
        message: ''
    });

    useEffect(() => {
        const fetchContactDetails = async () => {
            const { data } = await supabase.from('company').select('*').eq('id', 1).single();
            if (data) {
                setContactInfo({
                    email: data.email || '',
                    phone: data.phone || '',
                    whatsapp: data.whatsapp || '',
                    address: data.address || '',
                    google_map_embed_url: data.google_map_embed_url || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    youtube_url: data.youtube_url || '',
                    linkedin_url: data.linkedin_url || ''
                });
            }
        };
        fetchContactDetails();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // THE HONEYPOT TRAP
        // If a bot filled this out, silently pretend it was successful and stop executing.
        if (botTrap !== '') {
            console.warn("Bot detected. Submission blocked.");
            setFormData({ name: '', phone: '', service: 'Kitchen Design', message: '' });
            alert("Message sent successfully! We will contact you soon.");
            return;
        }

        setIsSending(true);

        try {
            const { error: dbError } = await supabase.from('contact_messages').insert([{
                name: formData.name,
                phone: formData.phone,
                service_interest: formData.service,
                message: formData.message,
                status: 'new'
            }]);

            if (dbError) throw dbError;

            const targetNumber = contactInfo.whatsapp || '919876543210';
            const waText = encodeURIComponent(`Hi Vortex Infra,\nI would like to inquire about ${formData.service}.\nMy name is ${formData.name}.\n\n${formData.message}`);
            const waUrl = `https://wa.me/${targetNumber}?text=${waText}`;

            window.open(waUrl, '_blank');

            setFormData({ name: '', phone: '', service: 'Kitchen Design', message: '' });
            alert("Message sent successfully! We will contact you soon.");

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const getMapSrc = (input: string) => {
        if (!input) return '';
        if (input.includes('<iframe')) {
            const match = input.match(/src="([^"]+)"/);
            return match ? match[1] : '';
        }
        return input;
    };

    return (
        <Helmet>
            <title>Contact Vortex Infra | Get a Design Consultation in Ranchi</title>
            <meta
                name="description"
                content="Ready to transform your home or office space? Contact Vortex Infra in Ranchi for inquiries, project quotes, showroom visits, and consultations."
            />
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 font-sans selection:bg-primary/30">

            
            

            {/* Cinematic Hero Header (Lightened Colors) */}
            <div className="bg-slate-800 dark:bg-slate-900 pt-32 pb-48 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-800 to-slate-800 dark:from-blue-600/15 dark:via-slate-900 dark:to-slate-900"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Connect With Us</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Project.</span>
                    </h1>
                    <p className="text-lg text-slate-300 font-light max-w-xl mx-auto">
                        Whether you have a clear vision or just a blank canvas, our team is ready to bring your architectural dreams to life.
                    </p>
                </div>
            </div>

            {/* Overlapping Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 space-y-8">

                {/* TOP SECTION: Form and Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT: Premium Booking Form (7 Columns) */}
                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white/20 p-8 md:p-12">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Send an Inquiry</h2>
                            <p className="text-gray-500 dark:text-gray-400">Fill out the details below and we'll instantly connect over WhatsApp.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* INVISIBLE HONEYPOT FIELD */}
                                <input
                                    type="text"
                                    name="website_url"
                                    value={botTrap}
                                    onChange={(e) => setBotTrap(e.target.value)}
                                    className="opacity-0 absolute -z-10 h-0 w-0"
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                                    <input required type="text" className="w-full bg-gray-50 dark:bg-slate-950 border-transparent rounded-2xl p-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                                    <input required type="tel" className="w-full bg-gray-50 dark:bg-slate-950 border-transparent rounded-2xl p-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                                        value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Service of Interest</label>
                                <select className="w-full bg-gray-50 dark:bg-slate-950 border-transparent rounded-2xl p-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm cursor-pointer"
                                    value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })}>
                                    <option>Bespoke Kitchen Design</option>
                                    <option>Custom Doors & Windows</option>
                                    <option>Luxury Beds & Furniture</option>
                                    <option>TV Units & Living Spaces</option>
                                    <option>General Consultation</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Project Details</label>
                                <textarea required rows={5} className="w-full bg-gray-50 dark:bg-slate-950 border-transparent rounded-2xl p-4 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-sm"
                                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us a bit about what you are looking to create..." />
                            </div>

                            <button disabled={isSending} type="submit" className="w-full bg-slate-900 hover:bg-primary dark:bg-primary dark:hover:bg-blue-600 text-white font-bold text-lg py-5 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group mt-4">
                                {isSending ? 'Routing Request...' : 'Start Conversation'}
                                {!isSending && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: Contact Details (5 Columns) */}
                    <div className="lg:col-span-5 h-full">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 border border-gray-100 dark:border-slate-800 h-full flex flex-col">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-800 pb-4">Contact Information</h3>

                            <div className="space-y-8 flex-1">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Direct Line</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{contactInfo.phone || 'Loading...'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <Mail size={22} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Email</p>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg truncate">{contactInfo.email || 'Loading...'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Studio Location</p>
                                        <p className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{contactInfo.address || 'Loading...'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Strip */}
                            <div className="flex gap-3 pt-8 mt-8 border-t border-gray-100 dark:border-slate-800">
                                {contactInfo.instagram_url && (
                                    <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                        <Instagram size={18} />
                                    </a>
                                )}
                                {contactInfo.facebook_url && (
                                    <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                        <Facebook size={18} />
                                    </a>
                                )}
                                {contactInfo.youtube_url && (
                                    <a href={contactInfo.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                        <Youtube size={18} />
                                    </a>
                                )}
                                {contactInfo.linkedin_url && (
                                    <a href={contactInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Full Width Large Colorful Map */}
                {contactInfo.google_map_embed_url && (
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800">

                        {/* New Section Header for the Map */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-2">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Visit Our Studio</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get directions to our main headquarters.</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-green-700 dark:text-green-400 w-fit">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                </span>
                                Open for visitors
                            </div>
                        </div>

                        <div className="w-full h-[500px] bg-gray-200 dark:bg-slate-800 rounded-[2rem] overflow-hidden relative border border-gray-100 dark:border-slate-800">
                            <iframe
                                src={getMapSrc(contactInfo.google_map_embed_url)}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                )}

            </div>
        </div>
        </Helmet>
    );
};

export default Contact;