'use client';

import { useEffect, useState } from 'react';
import {
    Mail,
    Phone,
    Calendar,
    User,
    MessageSquare,
    Search,
    Filter,
    Download,
    Trash2,
    Eye,
    Loader2,
    AlertCircle,
    X,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactSubmission {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    ip: string;
    userAgent: string;
    createdAt: string;
    updatedAt: string;
}

const SUBJECT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    volunteer: { label: 'Volunteering', color: '#10b981', bg: '#d1fae5' },
    donate: { label: 'Donation', color: '#f59e0b', bg: '#fef3c7' },
    partnership: { label: 'Partnership', color: '#8b5cf6', bg: '#ede9fe' },
    general: { label: 'General', color: '#3b82f6', bg: '#dbeafe' },
    other: { label: 'Other', color: '#6b7280', bg: '#f3f4f6' },
};

export default function ContactsPage() {
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');
    const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    async function fetchContacts() {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/contacts');
            if (!res.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await res.json();
            setContacts(data.contacts || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load contacts');
            toast.error('Failed to load contact submissions');
        } finally {
            setLoading(false);
        }
    }

    async function executeDelete(id: string) {
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete contact');
            }

            setContacts(contacts.filter((c) => c._id !== id));
            setSelectedContact(null);
            setDeleteConfirmId(null);
            toast.success('Contact submission deleted successfully');
        } catch {
            toast.error('Failed to delete contact submission');
        } finally {
            setDeleting(false);
        }
    }

    function handleExport() {
        const csv = [
            ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'IP'].join(','),
            ...filteredContacts.map((c) =>
                [
                    new Date(c.createdAt).toLocaleString(),
                    `${c.firstName} ${c.lastName}`,
                    c.email,
                    c.phone || '',
                    SUBJECT_LABELS[c.subject]?.label || c.subject,
                    `"${c.message.replace(/"/g, '""')}"`,
                    c.ip,
                ].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Contacts exported successfully');
    }

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            searchTerm === '' ||
            contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterSubject === 'all' || contact.subject === filterSubject;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[--ngo-orange]" />
                    <p className="text-[--ngo-gray]">Loading contact submissions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="flex flex-col items-center gap-4 text-red-600">
                    <AlertCircle className="w-12 h-12" />
                    <p>{error}</p>
                    <button
                        onClick={fetchContacts}
                        className="px-4 py-2 bg-[--ngo-orange] text-white rounded-lg hover:bg-[--ngo-orange-dark]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[--ngo-dark]">Contact Submissions</h1>
                    <p className="text-[--ngo-gray] text-sm md:text-base mt-1">
                        Manage and respond to contact form submissions
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[--ngo-green] text-white rounded-lg hover:bg-[--ngo-green-dark] transition-colors text-sm md:text-base w-full sm:w-auto touch-manipulation"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[--ngo-gray] text-xs md:text-sm">Total</p>
                            <p className="text-xl md:text-2xl font-bold text-[--ngo-dark] mt-1">
                                {contacts.length}
                            </p>
                        </div>
                        <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-[--ngo-orange] opacity-20" />
                    </div>
                </div>

                {Object.entries(SUBJECT_LABELS).map(([key, { label, color }]) => (
                    <div key={key} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[--ngo-gray] text-xs md:text-sm truncate">{label}</p>
                                <p className="text-xl md:text-2xl font-bold text-[--ngo-dark] mt-1">
                                    {contacts.filter((c) => c.subject === key).length}
                                </p>
                            </div>
                            <div
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: color + '20' }}
                            >
                                <Mail className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--ngo-orange] focus:border-transparent outline-none text-sm md:text-base"
                        />
                    </div>

                    {/* Filter by Subject */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="w-full md:w-auto pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[--ngo-orange] focus:border-transparent outline-none appearance-none bg-white text-sm md:text-base md:min-w-50"
                        >
                            <option value="all">All Subjects</option>
                            {Object.entries(SUBJECT_LABELS).map(([key, { label }]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-[--ngo-gray] text-sm">
                Showing {filteredContacts.length} of {contacts.length} submissions
            </p>

            {/* Contacts List */}
            {filteredContacts.length === 0 ? (
                <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-[--ngo-dark] mb-2">
                        No submissions found
                    </h3>
                    <p className="text-[--ngo-gray] text-sm md:text-base">
                        {searchTerm || filterSubject !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Contact form submissions will appear here'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3 md:gap-4">
                    {filteredContacts.map((contact) => {
                        const subjectInfo = SUBJECT_LABELS[contact.subject];
                        return (
                            <div
                                key={contact._id}
                                className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4">
                                    <div className="flex-1 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-semibold text-[--ngo-dark]">
                                                {contact.firstName} {contact.lastName}
                                            </h3>
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: subjectInfo?.bg,
                                                    color: subjectInfo?.color,
                                                }}
                                            >
                                                {subjectInfo?.label || contact.subject}
                                            </span>
                                            <span className="text-sm text-[--ngo-gray]">
                                                {new Date(contact.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-[--ngo-gray]">
                                                <Mail className="w-4 h-4" />
                                                <a
                                                    href={`mailto:${contact.email}`}
                                                    className="hover:text-[--ngo-orange] transition-colors"
                                                >
                                                    {contact.email}
                                                </a>
                                            </div>
                                            {contact.phone && (
                                                <div className="flex items-center gap-2 text-[--ngo-gray]">
                                                    <Phone className="w-4 h-4" />
                                                    <a
                                                        href={`tel:${contact.phone}`}
                                                        className="hover:text-[--ngo-orange] transition-colors"
                                                    >
                                                        {contact.phone}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Preview */}
                                        <p className="text-[--ngo-gray] text-sm line-clamp-2">
                                            {contact.message}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedContact(contact)}
                                            className="p-2 text-[--ngo-dark] hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        {deleteConfirmId === contact._id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => executeDelete(contact._id)}
                                                    disabled={deleting}
                                                    className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors touch-manipulation disabled:opacity-50"
                                                    title="Confirm Delete"
                                                >
                                                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirmId(null)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                                                    title="Cancel"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmId(contact._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {selectedContact && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedContact(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[--ngo-dark]">
                                    Contact Details
                                </h2>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[--ngo-gray]">
                                        Name
                                    </label>
                                    <p className="text-lg font-semibold text-[--ngo-dark] mt-1">
                                        {selectedContact.firstName} {selectedContact.lastName}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-[--ngo-gray]">
                                            Email
                                        </label>
                                        <p className="text-[--ngo-dark] mt-1">
                                            <a
                                                href={`mailto:${selectedContact.email}`}
                                                className="text-[--ngo-orange] hover:underline"
                                            >
                                                {selectedContact.email}
                                            </a>
                                        </p>
                                    </div>

                                    {selectedContact.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-[--ngo-gray]">
                                                Phone
                                            </label>
                                            <p className="text-[--ngo-dark] mt-1">
                                                <a
                                                    href={`tel:${selectedContact.phone}`}
                                                    className="text-[--ngo-orange] hover:underline"
                                                >
                                                    {selectedContact.phone}
                                                </a>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-[--ngo-gray]">
                                        Subject
                                    </label>
                                    <p className="text-[--ngo-dark] mt-1">
                                        <span
                                            className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor:
                                                    SUBJECT_LABELS[selectedContact.subject]?.bg,
                                                color: SUBJECT_LABELS[selectedContact.subject]?.color,
                                            }}
                                        >
                                            {SUBJECT_LABELS[selectedContact.subject]?.label ||
                                                selectedContact.subject}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-[--ngo-gray]">
                                        Message
                                    </label>
                                    <p className="text-[--ngo-dark] mt-1 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                        {selectedContact.message}
                                    </p>
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="pt-6 border-t border-gray-200 space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-[--ngo-gray]">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Submitted: {new Date(selectedContact.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[--ngo-gray]">
                                    <User className="w-4 h-4" />
                                    <span>IP: {selectedContact.ip}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <a
                                    href={`mailto:${selectedContact.email}?subject=Re: ${SUBJECT_LABELS[selectedContact.subject]?.label
                                        }`}
                                    className="flex-1 px-4 py-2 bg-[--ngo-orange] text-white rounded-lg hover:bg-[--ngo-orange-dark] transition-colors text-center"
                                >
                                    Reply via Email
                                </a>
                                {deleteConfirmId === selectedContact._id ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => executeDelete(selectedContact._id)}
                                            disabled={deleting}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(null)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeleteConfirmId(selectedContact._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
