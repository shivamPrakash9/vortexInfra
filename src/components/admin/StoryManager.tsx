import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, Loader2, BookOpen, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

const StoryManager = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // New States for Listing and Editing
    const [storiesList, setStoriesList] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const initialFormState = {
        title: '',
        description: '',
        display_order: 0,
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch all stories on load
    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setIsLoadingList(true);
        const { data, error } = await supabase.from('stories').select('*').order('display_order', { ascending: true });
        if (data) setStoriesList(data);
        setIsLoadingList(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = editingId ? storiesList.find(s => s.id === editingId)?.image_url : null;

            // 1. Upload new image if selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `stories/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                display_order: formData.display_order,
                is_active: formData.is_active,
                image_url: imageUrl
            };

            // 2. Either UPDATE or INSERT
            if (editingId) {
                const { error } = await supabase.from('stories').update(payload).eq('id', editingId);
                if (error) throw error;
                alert('Story updated successfully!');
            } else {
                const { error } = await supabase.from('stories').insert([payload]);
                if (error) throw error;
                alert('Story added successfully!');
            }

            // Reset & Refresh
            cancelEdit();
            fetchStories();

        } catch (err: any) {
            alert('Error saving story: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this story?")) return;
        try {
            const { error } = await supabase.from('stories').delete().eq('id', id);
            if (error) throw error;
            fetchStories();
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const handleEdit = (story: any) => {
        setEditingId(story.id);
        setFormData({
            title: story.title,
            description: story.description || '',
            display_order: story.display_order || 0,
            is_active: story.is_active
        });
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setFile(null);
        (document.getElementById('story-form') as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-4xl">

            {/* TOP SECTION: ADD/EDIT FORM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <BookOpen className="text-primary" />
                        {editingId ? 'Edit Story' : 'Add Company Story'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} type="button" className="text-sm font-bold text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form id="story-form" onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Story Title</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Story Description</label>
                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Display Order (Optional)</label>
                            <input type="number" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" placeholder="0" />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon size={16} /> {editingId ? 'Replace Cover Image' : 'Story Cover Image'}
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="font-bold text-gray-700">Make this story visible</span>
                        </label>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit2 size={20} /> : <Upload size={20} />)}
                        {isUploading ? 'Saving...' : (editingId ? 'Update Story' : 'Add Story')}
                    </button>
                </form>
            </div>

            {/* BOTTOM SECTION: MANAGE EXISTING LIST */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6">Manage Existing Stories</h3>

                {isLoadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : storiesList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No stories found. Add one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="p-3 text-sm font-bold text-gray-500">Image</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Title</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Order</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-bold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {storiesList.map((story) => (
                                    <tr key={story.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            {story.image_url ? (
                                                <img src={story.image_url} alt={story.title} className="w-16 h-12 rounded object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-16 h-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 font-bold">NA</div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{story.title}</div>
                                        </td>
                                        <td className="p-3">
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{story.display_order}</span>
                                        </td>
                                        <td className="p-3">
                                            {story.is_active ?
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span> :
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Hidden</span>
                                            }
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(story)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(story.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
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

export default StoryManager;