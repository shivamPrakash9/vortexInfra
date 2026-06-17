import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, Loader2, Plus, Minus, Briefcase, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

const ServicesManager = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // New States for Listing and Editing
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const initialFormState = {
        title: '',
        short_description: '',
        full_description: '',
        starting_price: '',
        pricing_note: '',
        display_order: 0,
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormState);
    const [features, setFeatures] = useState<string[]>(['']);

    // Fetch all services on load
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoadingList(true);
        const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
        if (data) setServicesList(data);
        setIsLoadingList(false);
    };

    const handleAddFeature = () => setFeatures([...features, '']);
    const handleRemoveFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
    const handleFeatureChange = (text: string, index: number) => {
        const newFeatures = [...features];
        newFeatures[index] = text;
        setFeatures(newFeatures);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = editingId ? servicesList.find(s => s.id === editingId)?.image_url : null;

            // 1. Upload new image if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `services/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            const cleanFeatures = features.filter(f => f.trim() !== '');

            const payload = {
                ...formData,
                features: cleanFeatures,
                image_url: imageUrl
            };

            // 2. Either UPDATE or INSERT
            if (editingId) {
                const { error } = await supabase.from('services').update(payload).eq('id', editingId);
                if (error) throw error;
                alert('Service updated successfully!');
            } else {
                const { error } = await supabase.from('services').insert([payload]);
                if (error) throw error;
                alert('Service added successfully!');
            }

            // Reset & Refresh
            cancelEdit();
            fetchServices();

        } catch (err: any) {
            alert('Error saving service: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            const { error } = await supabase.from('services').delete().eq('id', id);
            if (error) throw error;
            fetchServices();
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const handleEdit = (service: any) => {
        setEditingId(service.id);
        setFormData({
            title: service.title,
            short_description: service.short_description || '',
            full_description: service.full_description || '',
            starting_price: service.starting_price || '',
            pricing_note: service.pricing_note || '',
            display_order: service.display_order || 0,
            is_active: service.is_active
        });

        // Safely load the JSON features back into the array
        let loadedFeatures = [''];
        if (Array.isArray(service.features) && service.features.length > 0) {
            loadedFeatures = service.features;
        }
        setFeatures(loadedFeatures);

        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setFeatures(['']);
        setFile(null);
        (document.getElementById('services-form') as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-5xl">

            {/* TOP SECTION: ADD/EDIT FORM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <Briefcase className="text-primary" />
                        {editingId ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} type="button" className="text-sm font-bold text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form id="services-form" onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price (Optional)</label>
                            <input type="text" value={formData.starting_price} onChange={e => setFormData({ ...formData, starting_price: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Short Description (For Cards)</label>
                            <textarea required rows={2} value={formData.short_description} onChange={e => setFormData({ ...formData, short_description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Description (For Details Page)</label>
                            <textarea rows={4} value={formData.full_description} onChange={e => setFormData({ ...formData, full_description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                        </div>
                    </div>

                    {/* Dynamic Features List */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-4">Service Features / What's Included</label>
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex-grow">
                                        <input type="text" value={feature} onChange={e => handleFeatureChange(e.target.value, index)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" placeholder={`Feature ${index + 1}...`} />
                                    </div>
                                    {features.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveFeature(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Minus size={20} /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddFeature} className="mt-4 flex items-center gap-2 text-sm font-bold text-primary hover:text-slate-900 transition-colors">
                            <Plus size={16} /> Add Another Feature
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16} /> {editingId ? 'Replace Cover Image' : 'Service Cover Image'}</label>
                            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <div className="flex items-center gap-4 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                <span className="font-bold text-gray-700">Make this service visible</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit2 size={20} /> : <Upload size={20} />)}
                        {isUploading ? 'Saving...' : (editingId ? 'Update Service' : 'Add Service')}
                    </button>
                </form>
            </div>

            {/* BOTTOM SECTION: MANAGE EXISTING LIST */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6">Manage Existing Services</h3>

                {isLoadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : servicesList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No services found. Add one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="p-3 text-sm font-bold text-gray-500">Image</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Title</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Features</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-bold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicesList.map((service) => (
                                    <tr key={service.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            {service.image_url ? (
                                                <img src={service.image_url} alt={service.title} className="w-16 h-12 rounded object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 font-bold">NA</div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{service.title}</div>
                                            <div className="text-xs text-gray-500">{service.starting_price}</div>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                {Array.isArray(service.features) ? `${service.features.length} features` : '0 features'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {service.is_active ?
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span> :
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Hidden</span>
                                            }
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(service.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesManager;