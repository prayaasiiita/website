'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

interface AuditLog {
    _id: string;
    action: string;
    resource: string;
    resourceId?: string;
    adminEmail: string;
    ipAddress: string;
    userAgent?: string;
    location?: string;
    geoLocation?: {
        city?: string;
        region?: string;
        country?: string;
        countryCode?: string;
        timezone?: string;
        lat?: number;
        lon?: number;
    };
    status: 'success' | 'failure';
    errorMessage?: string;
    timestamp: string;
    changes?: {
        before?: unknown;
        after?: unknown;
    };
}

interface AuditResponse {
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Filters
    const [resourceFilter, setResourceFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
            });

            if (resourceFilter) params.append('resource', resourceFilter);
            if (actionFilter) params.append('action', actionFilter);
            if (searchEmail) params.append('adminEmail', searchEmail);

            const res = await fetch(`/api/admin/audit-logs?${params}`, {
                credentials: 'include',
            });

            // Check if response is JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response format');
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || 'Failed to fetch logs');
            }

            const data: AuditResponse = await res.json();

            // Handle empty response
            if (!data || !data.logs) {
                setLogs([]);
                setTotalPages(1);
                setTotal(0);
            } else {
                setLogs(data.logs);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            }

            setError('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load audit logs';
            setError(errorMessage);
            console.error('Fetch audit logs error:', err);
            setLogs([]);
            setTotalPages(1);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [page, resourceFilter, actionFilter, searchEmail]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getActionBadge = (action: string) => {
        const colors: Record<string, string> = {
            login: 'bg-blue-500',
            logout: 'bg-gray-500',
            create: 'bg-green-500',
            update: 'bg-yellow-500',
            delete: 'bg-red-500',
            upload: 'bg-purple-500',
            password_change: 'bg-orange-500',
            password_reset_request: 'bg-orange-400',
            password_reset_complete: 'bg-orange-600',
        };
        return colors[action] || 'bg-gray-500';
    };

    const getStatusBadge = (status: string) => {
        return status === 'success'
            ? 'bg-green-500'
            : 'bg-red-500';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Audit Logs</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        Monitor all admin activities and system events
                    </p>
                </div>
                <Badge variant="outline" className="text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 self-start sm:self-auto">
                    {total} total events
                </Badge>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardHeader className="p-1 md:p-2">
                    <CardTitle className="text-base md:text-lg">Filters</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Filter audit logs by resource, action, or admin</CardDescription>
                </CardHeader>
                <CardContent className="p-1 md:p-2 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Resource</label>
                            <select
                                value={resourceFilter}
                                onChange={(e) => {
                                    setResourceFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">All Resources</option>
                                <option value="auth">Authentication</option>
                                <option value="admin">Admins</option>
                                <option value="volunteer">Volunteers</option>
                                <option value="event">Events</option>
                                <option value="team">Team</option>
                                <option value="content">Content</option>
                                <option value="gallery">Gallery</option>
                                <option value="empowerment">Empowerments</option>
                                <option value="site_settings">Site Settings</option>
                                <option value="contact_submission">Contacts</option>
                                <option value="tag">Tags</option>
                                <option value="image">Images</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Action</label>
                            <select
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">All Actions</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                                <option value="upload">Upload</option>
                                <option value="password_change">Password Change</option>
                                <option value="password_reset">Password Reset</option>
                                <option value="view">View</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">All Status</option>
                                <option value="success">Success</option>
                                <option value="failure">Failure</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Search Email</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="admin@example.com"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                />
                                <Button onClick={() => { setPage(1); fetchLogs(); }}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setResourceFilter('');
                                setActionFilter('');
                                setStatusFilter('');
                                setSearchEmail('');
                                setPage(1);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center">Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No audit logs found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Time</th>
                                        <th className="text-left p-4 font-medium">Action</th>
                                        <th className="text-left p-4 font-medium">Resource</th>
                                        <th className="text-left p-4 font-medium">Location</th>
                                        <th className="text-left p-4 font-medium">IP / Geo</th>
                                        <th className="text-left p-4 font-medium">Admin</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log._id} className="border-b hover:bg-muted/30">
                                            <td className="p-4 text-sm">
                                                {formatDate(log.timestamp)}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getActionBadge(log.action)}>
                                                    {log.action.replace(/_/g, ' ')}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm font-medium">
                                                {log.resource}
                                                {log.resourceId && (
                                                    <div className="text-xs text-muted-foreground truncate max-w-25">
                                                        {log.resourceId}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-blue-600">
                                                {log.location || '-'}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="font-mono text-xs">{log.ipAddress}</div>
                                                {log.geoLocation && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        📍 {log.geoLocation.city && `${log.geoLocation.city}, `}
                                                        {log.geoLocation.country || 'Unknown'}
                                                        {log.geoLocation.countryCode && ` (${log.geoLocation.countryCode})`}
                                                        {log.geoLocation.lat && log.geoLocation.lon && (
                                                            <div className="mt-1">
                                                                <a
                                                                    href={`https://www.google.com/maps?q=${log.geoLocation.lat},${log.geoLocation.lon}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                                >
                                                                    🗺️ View on Map ({log.geoLocation.lat.toFixed(4)}, {log.geoLocation.lon.toFixed(4)})
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {log.adminEmail}
                                            </td>
                                            <td className="p-4 text-sm font-mono">
                                                {log.ipAddress}
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusBadge(log.status)}>
                                                    {log.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {log.errorMessage && (
                                                    <span className="text-xs text-red-500">
                                                        {log.errorMessage}
                                                    </span>
                                                )}
                                                {log.changes && (
                                                    <details className="text-xs">
                                                        <summary className="cursor-pointer text-blue-500">
                                                            View changes
                                                        </summary>
                                                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-w-75">
                                                            {JSON.stringify(log.changes, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                                {log.userAgent && (
                                                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-50">
                                                        {log.userAgent}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <Card>
                    <CardHeader className="pb-1 p-3 md:p-4 md:pb-1">
                        <CardTitle className="text-xs md:text-sm font-medium">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <p className="text-lg md:text-xl font-bold">{total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 p-3 md:p-4 md:pb-1">
                        <CardTitle className="text-xs md:text-sm font-medium">Failed Logins</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <p className="text-lg md:text-xl font-bold text-red-500">
                            {logs.filter(l => l.action === 'login' && l.status === 'failure').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 p-3 md:p-4 md:pb-1">
                        <CardTitle className="text-xs md:text-sm font-medium">Deletions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <p className="text-lg md:text-xl font-bold text-orange-500">
                            {logs.filter(l => l.action === 'delete').length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1 p-3 md:p-4 md:pb-1">
                        <CardTitle className="text-xs md:text-sm font-medium">Retention</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <p className="text-lg md:text-xl font-bold">90 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Security Notice */}
            <Alert>
                <AlertDescription>
                    🔒 Audit logs are automatically retained for 90 days. Logs older than 90 days are automatically deleted.
                    Sensitive data (passwords, tokens) is automatically redacted from logs.
                </AlertDescription>
            </Alert>
        </div>
    );
}
