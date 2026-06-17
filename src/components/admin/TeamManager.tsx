import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Upload, Loader2, UserPlus, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';

const TeamManager = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    // New States for Listing and Editing
    const [teamList, setTeamList] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    const initialFormState = {
        name: '',
        designation: '',
        type: 'worker',
        bio: '',
        experience_years: 0,
        is_active: true
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch all team members on load
    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setIsLoadingList(true);
        const { data, error } = await supabase.from('team').select('*').order('id', { ascending: true });
        if (data) setTeamList(data);
        setIsLoadingList(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = editingId ? teamList.find(t => t.id === editingId)?.image_url : null;

            // 1. Upload new image if a new one was selected
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `team/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }

            const payload = {
                name: formData.name,
                designation: formData.designation,
                type: formData.type,
                bio: formData.bio,
                experience_years: formData.experience_years,
                is_active: formData.is_active,
                image_url: imageUrl
            };

            // 2. Either UPDATE or INSERT based on editingId state
            if (editingId) {
                const { error } = await supabase.from('team').update(payload).eq('id', editingId);
                if (error) throw error;
                alert('Team member updated!');
            } else {
                const { error } = await supabase.from('team').insert([payload]);
                if (error) throw error;
                alert('Team member added!');
            }

            // Reset Form & Refresh List
            cancelEdit();
            fetchTeam();

        } catch (err: any) {
            alert('Error saving team member: ' + err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this team member? This cannot be undone.")) return;
        try {
            const { error } = await supabase.from('team').delete().eq('id', id);
            if (error) throw error;
            fetchTeam(); // Refresh the list
        } catch (err: any) {
            alert("Error deleting: " + err.message);
        }
    };

    const handleEdit = (member: any) => {
        setEditingId(member.id);
        setFormData({
            name: member.name,
            designation: member.designation,
            type: member.type,
            bio: member.bio || '',
            experience_years: member.experience_years || 0,
            is_active: member.is_active
        });
        setFile(null); // Clear any pending file uploads
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setFile(null);
        (document.getElementById('team-form') as HTMLFormElement).reset();
    };

    return (
        <div className="space-y-8 max-w-5xl">

            {/* TOP SECTION: ADD/EDIT FORM */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                        <UserPlus className="text-primary" />
                        {editingId ? 'Edit Team Member' : 'Add New Team Member'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} type="button" className="text-sm font-bold text-gray-500 hover:text-gray-800">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form id="team-form" onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Designation / Title</label>
                            <input required type="text" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Role Type</label>
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none">
                                <option value="owner">Owner / Founder</option>
                                <option value="manager">Manager</option>
                                <option value="engineer">Engineer / Designer</option>
                                <option value="worker">Worker / Craftsman</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                            <input required type="number" min="0" value={formData.experience_years} onChange={e => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Short Bio</label>
                        <textarea rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none resize-none" />
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <ImageIcon size={16} /> {editingId ? 'Replace Profile Image (Optional)' : 'Profile Image'}
                        </label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="font-bold text-gray-700">Profile is Active (Visible on website)</span>
                        </label>
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : (editingId ? <Edit2 size={20} /> : <Upload size={20} />)}
                        {isUploading ? 'Saving...' : (editingId ? 'Update Team Member' : 'Add Team Member')}
                    </button>
                </form>
            </div>

            {/* BOTTOM SECTION: MANAGE EXISTING LIST */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-black mb-6">Manage Existing Team</h3>

                {isLoadingList ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : teamList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No team members found. Add one above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="p-3 text-sm font-bold text-gray-500">Image</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Name & Role</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Type</th>
                                    <th className="p-3 text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-sm font-bold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamList.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            {member.image_url ? (
                                                <img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">NA</div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-gray-900">{member.name}</div>
                                            <div className="text-xs text-gray-500">{member.designation}</div>
                                        </td>
                                        <td className="p-3">
                                            <span className="uppercase text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{member.type}</span>
                                        </td>
                                        <td className="p-3">
                                            {member.is_active ?
                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span> :
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Hidden</span>
                                            }
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
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

export default TeamManager;