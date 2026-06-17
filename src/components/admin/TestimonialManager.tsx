import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, Loader2, Star, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

const TestimonialManager = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // New States for Listing and Editing
    const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const initialFormState = {
        customer_name: '',
        designation: '',
        company_name: '',
        review: '',
        rating: 5,
        is_featured: true
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch all testimonials on load
    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoadingList(true);
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (data) setTestimonialsList(data);
        setIsLoadingList(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = editingId ? testimonialsList.find(t => t.id === editingId)?.image_url : null;

            // 1. Upload new image if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `testimonials/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            const payload = {
                customer_name: formData.customer_name,
                designation: formData.designation,
                company_name: formData.company_name,
                review: formData.review,
                rating: formData.rating,
                is_featured: formData.is_featured,
                image_url: imageUrl
            };

            // 2. Either UPDATE or INSERT
            if (editingId) {
                const { error } = await supabase.from('testimonials').update(payload).eq('id', editingId);
                if (error) throw error;
                alert('Testimonial updated successfully!');
            } else {
                const { error } = await supabase.from('testimonials').insert([payload]);
                if (error) throw error;
                alert('Testimonial added successfully!');
            }

            // Reset & Refresh
            cancelEdit();
            fetchTestimonials();

        } catch (err: any) {
            alert('Error saving testimonial: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
        try {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            fetchTestimonials();
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const handleEdit = (testimonial: any) => {
        setEditingId(testimonial.id);
        setFormData({
            customer_name: testimonial.customer_name,
            designation: testimonial.designation || '',
            company_name: testimonial.company_name || '',
            review: testimonial.review,
            rating: testimonial.rating || 5,
            is_featured: testimonial.is_featured
        });
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setFile(null);
        (document.getElementById('testimonial-form') as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-4xl">

            {/* TOP SECTION: ADD/EDIT FORM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <Star className="text-primary fill-primary" />
                        {editingId ? 'Edit Testimonial' : 'Add Client Testimonial'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} type="button" className="text-sm font-bold text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form id="testimonial-form" onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
                            <input required type="text" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating (1 to 5 Stars)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className={`${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'} transition-colors hover:text-yellow-400`}>
                                        <Star size={32} fill={formData.rating >= star ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Customer Designation (Optional)</label>
                            <input type="text" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Company/Estate Name (Optional)</label>
                            <input type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">The Review / Feedback</label>
                        <textarea required rows={4} value={formData.review} onChange={e => setFormData({ ...formData, review: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon size={16} /> {editingId ? 'Replace Customer Photo (Optional)' : 'Customer Photo / Logo (Optional)'}
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="font-bold text-gray-700">Feature this review on the Home Page</span>
                        </label>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit2 size={20} /> : <Upload size={20} />)}
                        {isUploading ? 'Saving...' : (editingId ? 'Update Testimonial' : 'Publish Testimonial')}
                    </button>
                </form>
            </div>

            {/* BOTTOM SECTION: MANAGE EXISTING LIST */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6">Manage Testimonials</h3>

                {isLoadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : testimonialsList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No testimonials found. Add one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="p-3 text-sm font-bold text-gray-500">Image</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Client</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Rating</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-bold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testimonialsList.map((testimony) => (
                                    <tr key={testimony.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            {testimony.image_url ? (
                                                <img src={testimony.image_url} alt={testimony.customer_name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
                                                    {testimony.customer_name.charAt(0)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{testimony.customer_name}</div>
                                            <div className="text-xs text-gray-500 truncate w-48">{testimony.review}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex text-yellow-500">
                                                {[...Array(testimony.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            {testimony.is_featured ?
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Featured</span> :
                                                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Standard</span>
                                            }
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(testimony)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(testimony.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
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

export default TestimonialManager;