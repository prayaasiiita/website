"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  year?: string;
  interests?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

type VolunteerStatusFilter = "all" | "pending" | "approved" | "rejected";

export default function VolunteersManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VolunteerStatusFilter>("all");

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      const res = await fetch("/api/admin/volunteers");
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchVolunteers();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  const filteredVolunteers = volunteers.filter((v) =>
    filter === "all" ? true : v.status === filter
  );

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--ngo-dark) mb-2">
          Volunteers Management
        </h1>
        <p className="text-(--ngo-gray)">
          Manage volunteer applications
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as VolunteerStatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-white text-(--ngo-gray) border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVolunteers.map((volunteer) => (
            <div
              key={volunteer._id}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-(--ngo-dark) mb-1">
                    {volunteer.name}
                  </h3>
                  <p className="text-(--ngo-gray) text-sm">
                    Applied on {new Date(volunteer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(volunteer.status)}
                  <span className="capitalize text-sm font-medium">
                    {volunteer.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-(--ngo-dark)">
                    Email:
                  </span>
                  <p className="text-(--ngo-gray)">{volunteer.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-(--ngo-dark)">
                    Phone:
                  </span>
                  <p className="text-(--ngo-gray)">{volunteer.phone}</p>
                </div>
                {volunteer.college && (
                  <div>
                    <span className="text-sm font-medium text-(--ngo-dark)">
                      College:
                    </span>
                    <p className="text-(--ngo-gray)">{volunteer.college}</p>
                  </div>
                )}
                {volunteer.year && (
                  <div>
                    <span className="text-sm font-medium text-(--ngo-dark)">
                      Year:
                    </span>
                    <p className="text-(--ngo-gray)">{volunteer.year}</p>
                  </div>
                )}
              </div>

              {volunteer.message && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-(--ngo-dark)">
                    Message:
                  </span>
                  <p className="text-(--ngo-gray) mt-1">{volunteer.message}</p>
                </div>
              )}

              {volunteer.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(volunteer._id, "approved")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(volunteer._id, "rejected")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
