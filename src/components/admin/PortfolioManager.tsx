import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, Loader2, Image as ImageIcon, Film, Plus, Trash2, Edit2, Briefcase, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const PortfolioManager = () => {
    const [isUploading, setIsUploading] = useState(false);

    // File States
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

    // Listing States
    const [portfolioList, setPortfolioList] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Dynamic Category State
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

    const initialFormState = {
        title: '',
        category: 'Kitchen',
        location: '',
        description: '',
        completion_date: '',
        is_featured: false
    };

    const [formData, setFormData] = useState(initialFormState);

    // Extract unique categories from the database, combined with some default fallbacks
    const existingCategories = Array.from(new Set(portfolioList.map(p => p.category).filter(Boolean)));
    const defaultCategories = ['Kitchen', 'Wardrobes', 'Doors', 'Beds', 'Living Room'];
    const allCategories = Array.from(new Set([...defaultCategories, ...existingCategories]));

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        setIsLoadingList(true);
        const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
        if (data) setPortfolioList(data);
        setIsLoadingList(false);
    };

    const uploadFile = async (file: File, folder: string) => {
        let fileToUpload = file;
        if (file.type.startsWith('image/')) {
            const options = {
                maxSizeMB: 1,          // Maximum file size target (1MB max, usually shrinks much lower)
                maxWidthOrHeight: 1920, // Resizes massive 4K/8K photos down to crisp Full HD
                useWebWorker: true,
                initialQuality: 0.8    // Subtle visual compression (80% quality retains crispness)
            };
            try {
                // Compress the image file before it hits Supabase Storage
                fileToUpload = await imageCompression(file, options);
            } catch (compressionError) {
                console.error("Compression failed, uploading original file:", compressionError);
            }
        }
        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error } = await supabase.storage.from('media').upload(fileName, fileToUpload);
        if (error) throw error;
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingId && !thumbnailFile) return alert('A main thumbnail image is required for new projects.');
        if (!formData.category.trim()) return alert('Please provide a category.');

        setIsUploading(true);

        try {
            const existingProject = editingId ? portfolioList.find(p => p.id === editingId) : null;
            let thumbnailUrl = existingProject?.thumbnail_url || null;
            let videoUrl = existingProject?.video_url || null;
            let galleryUrls = existingProject?.gallery_images || [];

            if (thumbnailFile) thumbnailUrl = await uploadFile(thumbnailFile, 'portfolio/thumbnails');
            if (videoFile) videoUrl = await uploadFile(videoFile, 'portfolio/videos');

            if (galleryFiles && galleryFiles.length > 0) {
                galleryUrls = [];
                for (let i = 0; i < galleryFiles.length; i++) {
                    const url = await uploadFile(galleryFiles[i], 'portfolio/gallery');
                    galleryUrls.push(url);
                }
            }

            const payload = {
                title: formData.title,
                category: formData.category.trim(), // Ensure clean category string
                location: formData.location,
                description: formData.description,
                completion_date: formData.completion_date || null,
                is_featured: formData.is_featured,
                thumbnail_url: thumbnailUrl,
                video_url: videoUrl,
                gallery_images: galleryUrls
            };

            if (editingId) {
                const { error } = await supabase.from('portfolio').update(payload).eq('id', editingId);
                if (error) throw error;
                alert('Project updated successfully!');
            } else {
                const { error } = await supabase.from('portfolio').insert([payload]);
                if (error) throw error;
                alert('Project published successfully!');
            }

            cancelEdit();
            fetchPortfolio();

        } catch (err: any) {
            alert('Error saving project: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            const { error } = await supabase.from('portfolio').delete().eq('id', id);
            if (error) throw error;
            fetchPortfolio();
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const handleEdit = (project: any) => {
        setEditingId(project.id);

        // If the project's category isn't in our list, switch to text input mode automatically
        if (!allCategories.includes(project.category)) {
            setIsAddingNewCategory(true);
        } else {
            setIsAddingNewCategory(false);
        }

        setFormData({
            title: project.title,
            category: project.category || 'Kitchen',
            location: project.location || '',
            description: project.description || '',
            completion_date: project.completion_date || '',
            is_featured: project.is_featured
        });

        setThumbnailFile(null);
        setVideoFile(null);
        setGalleryFiles(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setThumbnailFile(null);
        setVideoFile(null);
        setGalleryFiles(null);
        setIsAddingNewCategory(false);
        (document.getElementById('portfolio-form') as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-5xl">

            {/* TOP SECTION: ADD/EDIT FORM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <Briefcase className="text-primary" />
                        {editingId ? 'Edit Project' : 'Add New Project'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} type="button" className="text-sm font-bold text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form id="portfolio-form" onSubmit={handleUpload} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Project Title</label>
                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>

                        {/* DYNAMIC CATEGORY FIELD */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                            {!isAddingNewCategory ? (
                                <select
                                    value={formData.category}
                                    onChange={e => {
                                        if (e.target.value === 'ADD_NEW') {
                                            setIsAddingNewCategory(true);
                                            setFormData({ ...formData, category: '' }); // Clear for new input
                                        } else {
                                            setFormData({ ...formData, category: e.target.value });
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none bg-white cursor-pointer"
                                >
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option disabled>──────────</option>
                                    <option value="ADD_NEW" className="font-bold text-primary">➕ Add New Category...</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Type new category..."
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border border-primary rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingNewCategory(false);
                                            setFormData({ ...formData, category: allCategories[0] || 'Kitchen' });
                                        }}
                                        className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location / Client City</label>
                            <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Completion Date</label>
                            <input type="date" value={formData.completion_date} onChange={e => setFormData({ ...formData, completion_date: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Project Description</label>
                        <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                        <h4 className="font-bold text-lg border-b pb-2 flex items-center gap-2">Media Uploads</h4>
                        {editingId && <p className="text-xs text-orange-600 font-bold bg-orange-50 p-2 rounded">Note: Selecting new files will overwrite the existing media for this project.</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon size={16} /> {editingId ? 'Replace Thumbnail' : 'Main Thumbnail (Required)'}</label>
                                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Film size={16} /> Replace Video (Max 50MB)</label>
                                <input type="file" accept="video/mp4,video/webm" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Plus size={16} /> Replace Gallery Images (Multiple)</label>
                            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                            {galleryFiles && galleryFiles.length > 0 && <p className="text-sm text-primary font-bold mt-2">{galleryFiles.length} image(s) selected.</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="font-bold text-gray-700">Feature this project on the Home Page</span>
                        </label>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit2 size={20} /> : <Upload size={20} />)}
                        {isUploading ? 'Uploading & Saving...' : (editingId ? 'Update Project' : 'Publish Project')}
                    </button>
                </form>
            </div>

            {/* BOTTOM SECTION: MANAGE EXISTING LIST */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6">Manage Existing Projects</h3>

                {isLoadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : portfolioList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No projects found. Add one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="p-3 text-sm font-bold text-gray-500">Thumbnail</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Details</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Media Stats</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-bold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioList.map((project) => (
                                    <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            {project.thumbnail_url ? (
                                                <img src={project.thumbnail_url} alt={project.title} className="w-20 h-14 rounded object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-20 h-14 rounded bg-gray-200 flex items-center justify-center text-gray-400 font-bold">NA</div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{project.title}</div>
                                            <div className="text-xs text-gray-500">{project.category} • {project.location}</div>
                                        </td>
                                        <td className="p-3 text-xs text-gray-600">
                                            <div>Gallery: {Array.isArray(project.gallery_images) ? project.gallery_images.length : 0}</div>
                                            <div>Video: {project.video_url ? 'Yes' : 'No'}</div>
                                        </td>
                                        <td className="p-3">
                                            {project.is_featured ?
                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Featured</span> :
                                                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Standard</span>
                                            }
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
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

export default PortfolioManager;