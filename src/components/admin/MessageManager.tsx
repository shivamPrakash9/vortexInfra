import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, MessageSquare, Phone, Mail, Clock, CheckCircle, Trash2 } from 'lucide-react';

const MessageManager = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // Fetch all messages on load
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first

            if (error) throw error;
            if (data) setMessages(data);
        } catch (err: any) {
            console.error('Error fetching messages:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from('contact_messages')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Update local state so we don't have to reload the whole page
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status: newStatus } : msg
            ));

        } catch (err: any) {
            alert('Error updating status: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    // --- NEW DELETE FUNCTION ---
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;

        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Instantly remove it from the screen without a full page reload
            setMessages(messages.filter(msg => msg.id !== id));

        } catch (err: any) {
            alert('Error deleting message: ' + err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'contacted': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'closed': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 w-full">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                <MessageSquare className="text-primary" /> Client Inquiries Inbox
            </h3>
            <p className="text-gray-500 mb-8">Manage leads, track callbacks, and clear out spam or old requests.</p>

            {messages.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                    <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h4>
                    <p className="text-gray-500">No new client inquiries at the moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">

                            {/* Header: Name, Service & Status */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-black text-gray-900">{msg.name}</h4>
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {msg.service_interest || 'General Inquiry'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={14} />
                                        {new Date(msg.created_at).toLocaleDateString('en-US', {
                                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>

                                {/* Controls: Status Dropdown & Delete Button */}
                                <div className="flex items-center gap-3">
                                    {updatingId === msg.id && <Loader2 className="animate-spin text-gray-400" size={16} />}

                                    <select
                                        value={msg.status}
                                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                                        disabled={updatingId === msg.id}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold border outline-none appearance-none cursor-pointer transition-colors ${getStatusColor(msg.status)}`}
                                    >
                                        <option value="new">🟢 NEW LEAD</option>
                                        <option value="contacted">🟡 CONTACTED</option>
                                        <option value="closed">⚪ CLOSED / DONE</option>
                                    </select>

                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        disabled={updatingId === msg.id}
                                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                                        title="Delete Inquiry"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body: Contact Info & Message */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Left: Contact Info */}
                                <div className="md:col-span-1 space-y-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h5>
                                    <a href={`tel:${msg.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors font-medium">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                            <Phone size={16} />
                                        </div>
                                        {msg.phone}
                                    </a>
                                    {msg.email && (
                                        <a href={`mailto:${msg.email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors font-medium break-all">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                                <Mail size={16} />
                                            </div>
                                            {msg.email}
                                        </a>
                                    )}
                                </div>

                                {/* Right: The Actual Message */}
                                <div className="md:col-span-2">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Project Requirements / Message</h5>
                                    <div className="bg-gray-50 p-5 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessageManager;