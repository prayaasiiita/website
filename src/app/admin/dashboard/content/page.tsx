"use client";

import { useEffect, useState } from "react";
import { Edit, Save } from "lucide-react";

interface ContentItem {
  _id: string;
  section: string;
  key: string;
  value: string;
  type: string;
}

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setContent(data.content || []);
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: ContentItem) {
    setEditingId(item._id);
    setEditValue(item.value);
  }

  async function saveEdit(item: ContentItem) {
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: item.section,
          key: item.key,
          value: editValue,
          type: item.type,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchContent();
      }
    } catch (err) {
      console.error("Failed to save content:", err);
    }
  }

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
          Content Management
        </h1>
        <p className="text-(--ngo-gray)">
          Edit website text and content
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-(--ngo-yellow) border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedContent).map((section) => (
            <div key={section} className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-(--ngo-dark) mb-4 capitalize">
                {section}
              </h2>
              <div className="space-y-4">
                {groupedContent[section].map((item) => (
                  <div
                    key={item._id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-(--ngo-dark) mb-2 capitalize">
                          {item.key.replace(/_/g, " ")}
                        </label>
                        {editingId === item._id ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-(--ngo-yellow) focus:ring-2 focus:ring-(--ngo-yellow)/20 outline-none resize-none"
                          />
                        ) : (
                          <p className="text-(--ngo-gray)">{item.value}</p>
                        )}
                      </div>
                      <div>
                        {editingId === item._id ? (
                          <button
                            onClick={() => saveEdit(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
