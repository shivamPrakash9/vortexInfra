import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Save, Loader2, Image as ImageIcon, Map, Link as LinkIcon, Phone, Trash2, X } from 'lucide-react';

const CompanySettings = () => {
    const [isSaving, setIsSaving] = useState(false);

    // File states for images
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [heroFile, setHeroFile] = useState<File | null>(null);

    const [companyData, setCompanyData] = useState({
        name: '',
        tagline: '',
        about_short: '',
        mission: '',
        vision: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        google_map_embed_url: '',
        facebook_url: '',
        instagram_url: '',
        youtube_url: '',
        linkedin_url: '',
        projects_completed: 0,
        happy_clients: 0,
        years_experience: 0,
        logo: '',
        hero_image: ''
    });

    // Fetch existing data on load
    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase.from('company').select('*').eq('id', 1).single();
            if (data) {
                // Fallback null values to empty strings/numbers for React controlled inputs
                const sanitizedData = Object.keys(data).reduce((acc, key) => {
                    acc[key] = data[key] === null ? (typeof companyData[key as keyof typeof companyData] === 'number' ? 0 : '') : data[key];
                    return acc;
                }, {} as any);
                setCompanyData(sanitizedData);
            }
        };
        loadData();
    }, []);

    const uploadFile = async (file: File, folder: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error } = await supabase.storage.from('media').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let updatedLogo = companyData.logo;
            let updatedHero = companyData.hero_image;

            if (logoFile) updatedLogo = await uploadFile(logoFile, 'company/logo');
            if (heroFile) updatedHero = await uploadFile(heroFile, 'company/hero');

            const finalData = {
                ...companyData,
                logo: updatedLogo,
                hero_image: updatedHero,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase.from('company').update(finalData).eq('id', 1);
            if (error) throw error;

            setCompanyData(finalData);
            setLogoFile(null);
            setHeroFile(null);
            alert('Company profile successfully updated!');

        } catch (err: any) {
            alert('Error saving company details: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black mb-8">Company Settings & Branding</h3>

            <form onSubmit={handleSave} className="space-y-12">

                {/* Section 1: Core Identity */}
                <section>
                    <h4 className="font-bold text-lg border-b pb-2 mb-4 flex items-center gap-2">Core Identity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                            <input required type="text" value={companyData.name} onChange={e => setCompanyData({ ...companyData, name: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                            <input type="text" value={companyData.tagline} onChange={e => setCompanyData({ ...companyData, tagline: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., Crafting Excellence in Every Detail" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short About Text (Footer/Sidebar)</label>
                            <textarea rows={2} value={companyData.about_short} onChange={e => setCompanyData({ ...companyData, about_short: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Contact & Location */}
                <section>
                    <h4 className="font-bold text-lg border-b pb-2 mb-4 flex items-center gap-2"><Phone size={18} /> Contact & Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input type="email" value={companyData.email} onChange={e => setCompanyData({ ...companyData, email: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <input type="text" value={companyData.phone} onChange={e => setCompanyData({ ...companyData, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number (For Links)</label>
                            <input type="text" value={companyData.whatsapp} onChange={e => setCompanyData({ ...companyData, whatsapp: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., +919876543210" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Physical Address</label>
                            <input type="text" value={companyData.address} onChange={e => setCompanyData({ ...companyData, address: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Map size={16} /> Google Maps Embed URL</label>
                            <input type="text" value={companyData.google_map_embed_url} onChange={e => setCompanyData({ ...companyData, google_map_embed_url: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" placeholder="Paste the src link from Google Maps embed..." />
                        </div>
                    </div>
                </section>

                {/* Section 3: Social Links */}
                <section>
                    <h4 className="font-bold text-lg border-b pb-2 mb-4 flex items-center gap-2"><LinkIcon size={18} /> Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
                            <input type="url" value={companyData.instagram_url} onChange={e => setCompanyData({ ...companyData, instagram_url: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Channel URL</label>
                            <input type="url" value={companyData.youtube_url} onChange={e => setCompanyData({ ...companyData, youtube_url: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
                            <input type="url" value={companyData.facebook_url} onChange={e => setCompanyData({ ...companyData, facebook_url: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
                            <input type="url" value={companyData.linkedin_url} onChange={e => setCompanyData({ ...companyData, linkedin_url: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>
                </section>

                {/* Section 4: Statistics Metrics */}
                <section>
                    <h4 className="font-bold text-lg border-b pb-2 mb-4">Company Stats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Projects Completed</label>
                            <input type="number" value={companyData.projects_completed} onChange={e => setCompanyData({ ...companyData, projects_completed: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Happy Clients</label>
                            <input type="number" value={companyData.happy_clients} onChange={e => setCompanyData({ ...companyData, happy_clients: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                            <input type="number" value={companyData.years_experience} onChange={e => setCompanyData({ ...companyData, years_experience: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>
                </section>

                {/* Section 5: Media Uploads */}
                <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-lg border-b pb-2 mb-4 flex items-center gap-2"><ImageIcon size={18} /> Branding Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* LOGO UPLOAD AREA */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company Logo</label>

                            {/* Show existing logo with delete button */}
                            {companyData.logo && !logoFile && (
                                <div className="relative inline-block mb-4">
                                    <img src={companyData.logo} alt="Logo" className="h-16 object-contain bg-white p-2 border rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={() => setCompanyData({ ...companyData, logo: '' })}
                                        className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-full shadow-sm transition-colors"
                                        title="Remove currently saved logo"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}

                            {/* Show pending new file selection with cancel button */}
                            {logoFile && (
                                <div className="mb-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-bold border border-green-200">
                                    <span className="truncate max-w-[200px]">New: {logoFile.name}</span>
                                    <button type="button" onClick={() => setLogoFile(null)} className="text-red-500 hover:text-red-700 p-1"><X size={14} /></button>
                                </div>
                            )}

                            {/* Using the key attribute forces the input to clear its text when cancelled */}
                            <input
                                key={logoFile ? 'logo-selected' : 'logo-empty'}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>

                        {/* HERO IMAGE UPLOAD AREA */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Homepage Hero Image</label>

                            {/* Show existing hero with delete button */}
                            {companyData.hero_image && !heroFile && (
                                <div className="relative mb-4">
                                    <img src={companyData.hero_image} alt="Hero" className="h-24 w-full object-cover border rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={() => setCompanyData({ ...companyData, hero_image: '' })}
                                        className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-full shadow-sm transition-colors"
                                        title="Remove currently saved hero image"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {/* Show pending new file selection with cancel button */}
                            {heroFile && (
                                <div className="mb-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-bold border border-green-200">
                                    <span className="truncate max-w-[200px]">New: {heroFile.name}</span>
                                    <button type="button" onClick={() => setHeroFile(null)} className="text-red-500 hover:text-red-700 p-1"><X size={14} /></button>
                                </div>
                            )}

                            <input
                                key={heroFile ? 'hero-selected' : 'hero-empty'}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>

                    </div>
                </section>

                <button type="submit" disabled={isSaving} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? 'Saving Changes...' : 'Save Company Settings'}
                </button>
            </form>
        </div>
    );
};

export default CompanySettings;