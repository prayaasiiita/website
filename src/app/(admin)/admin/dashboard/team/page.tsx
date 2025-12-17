"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Plus,
    Pencil,
    Trash2,
    Users,
    GripVertical,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    Loader2,
    AlertCircle,
    Upload,
    ImageIcon,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    rollNo?: string;
    image: string;
    email: string;
    linkedin: string;
    order: number;
    isVisible: boolean;
}

interface TeamGroup {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    order: number;
    type: "leadership" | "faculty" | "student";
    members: TeamMember[];
    isVisible: boolean;
}

// Sortable Group Item Component
function SortableGroupItem({
    group,
    expanded,
    onToggle,
    onEdit,
    onDelete,
    onToggleVisibility,
    onAddMember,
    onEditMember,
    onDeleteMember,
    onToggleMemberVisibility,
    onMemberDragEnd,
    sensors,
}: {
    group: TeamGroup;
    expanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleVisibility: () => void;
    onAddMember: () => void;
    onEditMember: (member: TeamMember) => void;
    onDeleteMember: (memberId: string) => void;
    onToggleMemberVisibility: (member: TeamMember) => void;
    onMemberDragEnd: (event: DragEndEvent) => void;
    sensors: ReturnType<typeof useSensors>;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: group._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg border ${group.isVisible ? "border-gray-200" : "border-gray-300 bg-gray-50"
                } overflow-hidden`}
        >
            {/* Group Header */}
            <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none"
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 cursor-pointer" onClick={onToggle}>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[--ngo-dark]">
                            {group.name}
                        </h3>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${group.type === "leadership"
                                    ? "bg-purple-100 text-purple-700"
                                    : group.type === "faculty"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                        >
                            {group.type}
                        </span>
                        {!group.isVisible && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                Hidden
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        {group.members.length} member
                        {group.members.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleVisibility}
                        title={group.isVisible ? "Hide group" : "Show group"}
                    >
                        {group.isVisible ? (
                            <Eye className="w-4 h-4" />
                        ) : (
                            <EyeOff className="w-4 h-4" />
                        )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <button onClick={onToggle} className="p-1">
                        {expanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Members List */}
            {expanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-700">Members</h4>
                        <Button size="sm" onClick={onAddMember} className="gap-1">
                            <Plus className="w-3 h-3" />
                            Add Member
                        </Button>
                    </div>

                    {group.members.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">
                            No members in this group yet.
                        </p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={onMemberDragEnd}
                        >
                            <SortableContext
                                items={group.members.map((m) => m._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="grid gap-3">
                                    {group.members.map((member) => (
                                        <SortableMemberItem
                                            key={member._id}
                                            member={member}
                                            onEdit={() => onEditMember(member)}
                                            onDelete={() => onDeleteMember(member._id)}
                                            onToggleVisibility={() =>
                                                onToggleMemberVisibility(member)
                                            }
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            )}
        </div>
    );
}

// Sortable Member Item Component
function SortableMemberItem({
    member,
    onEdit,
    onDelete,
    onToggleVisibility,
}: {
    member: TeamMember;
    onEdit: () => void;
    onDelete: () => void;
    onToggleVisibility: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: member._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-3 rounded-lg ${member.isVisible
                    ? "bg-white border border-gray-200"
                    : "bg-gray-100 border border-gray-300"
                }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-[--ngo-orange]/20 to-[--ngo-green]/20 flex items-center justify-center overflow-hidden">
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <Users className="w-5 h-5 text-gray-400" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-[--ngo-dark] truncate">
                        {member.name}
                    </p>
                    {!member.isVisible && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                            Hidden
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {member.role}
                    {member.rollNo && ` • ${member.rollNo}`}
                </p>
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleVisibility}
                    title={member.isVisible ? "Hide" : "Show"}
                >
                    {member.isVisible ? (
                        <Eye className="w-4 h-4" />
                    ) : (
                        <EyeOff className="w-4 h-4" />
                    )}
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default function TeamManagementPage() {
    const [groups, setGroups] = useState<TeamGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Group modal state
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<TeamGroup | null>(null);
    const [groupForm, setGroupForm] = useState({
        name: "",
        description: "",
        type: "student" as "leadership" | "faculty" | "student",
        isVisible: true,
    });
    const [groupSaving, setGroupSaving] = useState(false);

    // Member modal state
    const [memberModalOpen, setMemberModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [memberForm, setMemberForm] = useState({
        name: "",
        role: "",
        rollNo: "",
        image: "",
        email: "",
        linkedin: "",
        isVisible: true,
    });
    const [memberSaving, setMemberSaving] = useState(false);

    // Image upload state
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Delete confirmation state
    const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
    const [deleteMember, setDeleteMember] = useState<{
        groupId: string;
        memberId: string;
    } | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Expanded groups state
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/team?includeHidden=true");
            if (!res.ok) throw new Error("Failed to fetch team groups");
            const data = await res.json();
            setGroups(data.groups);
            // Expand all groups by default
            setExpandedGroups(new Set(data.groups.map((g: TeamGroup) => g._id)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Toggle group expansion
    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            if (next.has(groupId)) {
                next.delete(groupId);
            } else {
                next.add(groupId);
            }
            return next;
        });
    };

    // Group CRUD handlers
    const openGroupModal = (group?: TeamGroup) => {
        if (group) {
            setEditingGroup(group);
            setGroupForm({
                name: group.name,
                description: group.description || "",
                type: group.type,
                isVisible: group.isVisible,
            });
        } else {
            setEditingGroup(null);
            setGroupForm({
                name: "",
                description: "",
                type: "student",
                isVisible: true,
            });
        }
        setGroupModalOpen(true);
    };

    const saveGroup = async () => {
        if (!groupForm.name.trim()) {
            setError("Group name is required");
            return;
        }

        setGroupSaving(true);
        try {
            const url = editingGroup ? `/api/team/${editingGroup._id}` : "/api/team";
            const method = editingGroup ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(groupForm),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save group");
            }

            await fetchGroups();
            setGroupModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save group");
        } finally {
            setGroupSaving(false);
        }
    };

    const deleteGroup = async () => {
        if (!deleteGroupId) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/team/${deleteGroupId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete group");

            await fetchGroups();
            setDeleteGroupId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete group");
        } finally {
            setDeleting(false);
        }
    };

    const toggleGroupVisibility = async (group: TeamGroup) => {
        try {
            const res = await fetch(`/api/team/${group._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: !group.isVisible }),
            });

            if (!res.ok) throw new Error("Failed to update visibility");

            await fetchGroups();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update visibility"
            );
        }
    };

    // Member CRUD handlers
    const openMemberModal = (groupId: string, member?: TeamMember) => {
        setSelectedGroupId(groupId);
        if (member) {
            setEditingMember(member);
            setMemberForm({
                name: member.name,
                role: member.role,
                rollNo: member.rollNo || "",
                image: member.image,
                email: member.email,
                linkedin: member.linkedin,
                isVisible: member.isVisible,
            });
        } else {
            setEditingMember(null);
            setMemberForm({
                name: "",
                role: "",
                rollNo: "",
                image: "",
                email: "",
                linkedin: "",
                isVisible: true,
            });
        }
        setMemberModalOpen(true);
    };

    const saveMember = async () => {
        if (!memberForm.name.trim() || !memberForm.email.trim()) {
            setError("Name and email are required");
            return;
        }

        if (!selectedGroupId) return;

        setMemberSaving(true);
        try {
            const url = editingMember
                ? `/api/team/${selectedGroupId}/members/${editingMember._id}`
                : `/api/team/${selectedGroupId}/members`;
            const method = editingMember ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberForm),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save member");
            }

            await fetchGroups();
            setMemberModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save member");
        } finally {
            setMemberSaving(false);
        }
    };

    const removeMember = async () => {
        if (!deleteMember) return;

        setDeleting(true);
        try {
            const res = await fetch(
                `/api/team/${deleteMember.groupId}/members/${deleteMember.memberId}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to remove member");

            await fetchGroups();
            setDeleteMember(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to remove member");
        } finally {
            setDeleting(false);
        }
    };

    const toggleMemberVisibility = async (groupId: string, member: TeamMember) => {
        try {
            const res = await fetch(`/api/team/${groupId}/members/${member._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVisible: !member.isVisible }),
            });

            if (!res.ok) throw new Error("Failed to update visibility");

            await fetchGroups();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update visibility"
            );
        }
    };

    // Drag and drop handlers
    const handleGroupDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = groups.findIndex((g) => g._id === active.id);
        const newIndex = groups.findIndex((g) => g._id === over.id);

        const newGroups = arrayMove(groups, oldIndex, newIndex);
        setGroups(newGroups);

        // Send reorder to API
        try {
            const groupOrders = newGroups.map((g, idx) => ({
                groupId: g._id,
                order: idx,
            }));

            const res = await fetch("/api/team/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupOrders }),
            });

            if (!res.ok) throw new Error("Failed to reorder groups");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder groups");
            await fetchGroups(); // Revert on failure
        }
    };

    const handleMemberDragEnd = async (groupId: string, event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const group = groups.find((g) => g._id === groupId);
        if (!group) return;

        const oldIndex = group.members.findIndex((m) => m._id === active.id);
        const newIndex = group.members.findIndex((m) => m._id === over.id);

        const newMembers = arrayMove(group.members, oldIndex, newIndex);

        // Optimistic update
        setGroups((prev) =>
            prev.map((g) =>
                g._id === groupId ? { ...g, members: newMembers } : g
            )
        );

        // Send reorder to API
        try {
            const memberOrders = newMembers.map((m, idx) => ({
                memberId: m._id,
                order: idx,
            }));

            const res = await fetch(`/api/team/${groupId}/members`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberOrders }),
            });

            if (!res.ok) throw new Error("Failed to reorder members");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reorder members");
            await fetchGroups(); // Revert on failure
        }
    };

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File too large. Maximum size is 5MB.");
            return;
        }

        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "team");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to upload image");
            }

            const data = await res.json();
            setMemberForm({ ...memberForm, image: data.url });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload image");
        } finally {
            setImageUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = () => {
        setMemberForm({ ...memberForm, image: "" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[--ngo-orange]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[--ngo-dark]">
                        Team Management
                    </h1>
                    <p className="text-[--ngo-gray] mt-1">
                        Manage team groups and members displayed on the About page
                    </p>
                </div>
                <Button onClick={() => openGroupModal()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Group
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Groups List */}
            <div className="space-y-4">
                {groups.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No team groups</h3>
                        <p className="text-gray-500 mt-1">
                            Get started by creating your first team group.
                        </p>
                        <Button onClick={() => openGroupModal()} className="mt-4 gap-2">
                            <Plus className="w-4 h-4" />
                            Add Group
                        </Button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleGroupDragEnd}
                    >
                        <SortableContext
                            items={groups.map((g) => g._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {groups.map((group) => (
                                <SortableGroupItem
                                    key={group._id}
                                    group={group}
                                    expanded={expandedGroups.has(group._id)}
                                    onToggle={() => toggleGroup(group._id)}
                                    onEdit={() => openGroupModal(group)}
                                    onDelete={() => setDeleteGroupId(group._id)}
                                    onToggleVisibility={() => toggleGroupVisibility(group)}
                                    onAddMember={() => openMemberModal(group._id)}
                                    onEditMember={(member) => openMemberModal(group._id, member)}
                                    onDeleteMember={(memberId) =>
                                        setDeleteMember({ groupId: group._id, memberId })
                                    }
                                    onToggleMemberVisibility={(member) =>
                                        toggleMemberVisibility(group._id, member)
                                    }
                                    onMemberDragEnd={(event) =>
                                        handleMemberDragEnd(group._id, event)
                                    }
                                    sensors={sensors}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Group Modal */}
            <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingGroup ? "Edit Group" : "Create Group"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingGroup
                                ? "Update the team group details"
                                : "Add a new team group to organize members"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="groupName">Group Name *</Label>
                            <Input
                                id="groupName"
                                value={groupForm.name}
                                onChange={(e) =>
                                    setGroupForm({ ...groupForm, name: e.target.value })
                                }
                                placeholder="e.g., Coordinators"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="groupDescription">Description</Label>
                            <Textarea
                                id="groupDescription"
                                value={groupForm.description}
                                onChange={(e) =>
                                    setGroupForm({ ...groupForm, description: e.target.value })
                                }
                                placeholder="Optional description for this group"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="groupType">Group Type</Label>
                            <Select
                                value={groupForm.type}
                                onValueChange={(value: "leadership" | "faculty" | "student") =>
                                    setGroupForm({ ...groupForm, type: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leadership">Leadership</SelectItem>
                                    <SelectItem value="faculty">Faculty</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="groupVisible"
                                checked={groupForm.isVisible}
                                onChange={(e) =>
                                    setGroupForm({ ...groupForm, isVisible: e.target.checked })
                                }
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="groupVisible" className="font-normal">
                                Visible on website
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setGroupModalOpen(false)}
                            disabled={groupSaving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveGroup} disabled={groupSaving} className="gap-2">
                            {groupSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {editingGroup ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Member Modal */}
            <Dialog open={memberModalOpen} onOpenChange={setMemberModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingMember ? "Edit Member" : "Add Member"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMember
                                ? "Update the team member details"
                                : "Add a new member to this group"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label htmlFor="memberName">Name *</Label>
                            <Input
                                id="memberName"
                                value={memberForm.name}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, name: e.target.value })
                                }
                                placeholder="Full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="memberRole">Role *</Label>
                            <Input
                                id="memberRole"
                                value={memberForm.role}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, role: e.target.value })
                                }
                                placeholder="e.g., Coordinator, Media Team"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="memberRollNo">Roll Number</Label>
                            <Input
                                id="memberRollNo"
                                value={memberForm.rollNo}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, rollNo: e.target.value })
                                }
                                placeholder="e.g., IIT2023199"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="memberEmail">Email *</Label>
                            <Input
                                id="memberEmail"
                                type="email"
                                value={memberForm.email}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, email: e.target.value })
                                }
                                placeholder="email@iiita.ac.in"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="memberLinkedin">LinkedIn URL</Label>
                            <Input
                                id="memberLinkedin"
                                value={memberForm.linkedin}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, linkedin: e.target.value })
                                }
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Profile Photo</Label>
                            <div className="flex items-start gap-4">
                                {/* Image Preview */}
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                    {memberForm.image ? (
                                        <>
                                            <Image
                                                src={memberForm.image}
                                                alt="Preview"
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                                unoptimized
                                                onError={() =>
                                                    setMemberForm((prev) => ({ ...prev, image: "" }))
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                title="Remove image"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                {/* Upload Controls */}
                                <div className="flex-1 space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={imageUploading}
                                        className="w-full gap-2"
                                    >
                                        {imageUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Upload Photo
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-xs text-gray-500">
                                        JPEG, PNG, WebP or GIF. Max 5MB.
                                    </p>
                                    <div className="text-xs text-gray-400">Or enter URL:</div>
                                    <Input
                                        id="memberImage"
                                        value={memberForm.image}
                                        onChange={(e) =>
                                            setMemberForm({ ...memberForm, image: e.target.value })
                                        }
                                        placeholder="https://..."
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="memberVisible"
                                checked={memberForm.isVisible}
                                onChange={(e) =>
                                    setMemberForm({ ...memberForm, isVisible: e.target.checked })
                                }
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="memberVisible" className="font-normal">
                                Visible on website
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setMemberModalOpen(false)}
                            disabled={memberSaving || imageUploading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={saveMember} disabled={memberSaving || imageUploading} className="gap-2">
                            {memberSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {editingMember ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Group Confirmation */}
            <AlertDialog
                open={!!deleteGroupId}
                onOpenChange={() => setDeleteGroupId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Team Group?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this group and all its members. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteGroup}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Member Confirmation */}
            <AlertDialog
                open={!!deleteMember}
                onOpenChange={() => setDeleteMember(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this member from the group. This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={removeMember}
                            disabled={deleting}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
