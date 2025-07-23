"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    organization: "",
    employment_type: "",
    remote: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    // Fetch data magang dan organizations
    fetchJobs(token);
    fetchOrganizations(token);
  }, [router, pagination.page, filters, fetchJobs, fetchOrganizations]);

  const fetchOrganizations = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-board/organizations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrganizations(data.data || []);
      } else {
        console.error("Error fetching organizations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchJobs = async (token) => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.organization && { organization: filters.organization }),
        ...(filters.employment_type && {
          employment_type: filters.employment_type,
        }),
        ...(filters.remote !== "" && { remote: filters.remote }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-board?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setJobs(data.data || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
      } else {
        setError(data.message || "Gagal mengambil data magang");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan");
      return;
    }

    // Validasi password baru jika diisi
    if (
      editForm.newPassword &&
      editForm.newPassword !== editForm.confirmPassword
    ) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
      };

      // Tambahkan password jika diisi
      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update user data di localStorage
        const updatedUser = {
          ...user,
          name: editForm.name,
          email: editForm.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        alert("Profil berhasil diperbarui!");
        setShowEditProfile(false);
        setEditForm({
          name: editForm.name,
          email: editForm.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    }
  };

  const handleApply = (job) => {
    // Buka link apply eksternal jika ada
    if (job.external_apply_url) {
      window.open(job.external_apply_url, "_blank");
    } else if (job.url) {
      window.open(job.url, "_blank");
    } else {
      alert("Link apply tidak tersedia untuk lowongan ini");
    }
  };

  const handleViewDetail = (job) => {
    setSelectedJob(job);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedJob(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset ke halaman 1
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatEmploymentType = (type) => {
    if (!type) return "";
    return type.replace(/[\[\]"]/g, "").replace(/,/g, ", ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data magang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation untuk user yang sudah login */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="/favicon.png"
                  alt="Cari Magang"
                  className="w-36 h-36"
                />
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="ml-2 text-sm">{user?.name || "User"}</span>
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowEditProfile(true);
                      setShowProfileDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section untuk user yang sudah login */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Temukan Magang Impianmu
              </h1>
              <p className="text-gray-600 mt-1">
                &quot;Platform perantara untuk mencari lowongan magang
                berkualitas&quot;
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <span className="mr-2">🎯</span>
                SDG 8 - Decent Work & Economic Growth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search dan Filter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi
              </label>
              <input
                type="text"
                placeholder="Cari posisi..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                placeholder="Cari lokasi..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perusahaan
              </label>
              <select
                value={filters.organization}
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Semua Perusahaan</option>
                {organizations.map((org) => (
                  <option key={org.organization} value={org.organization}>
                    {org.organization} ({org.job_count} lowongan)
                  </option>
                ))}
              </select>
            </div>
            {/* Commented karena project khusus untuk intern
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Pekerjaan
              </label>
              <select
                value={filters.employment_type}
                onChange={(e) =>
                  handleFilterChange("employment_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Semua Tipe</option>
                <option value="INTERN">Internship</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>
            */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remote
              </label>
              <select
                value={filters.remote}
                onChange={(e) => handleFilterChange("remote", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Semua</option>
                <option value="true">Remote</option>
                <option value="false">On-site</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content - List Internship */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Lowongan Tersedia
            </h2>
            <p className="text-gray-600">
              Menampilkan {jobs.length} dari {pagination.total} lowongan magang
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
          </div>
        </div>

        {/* Internship List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada lowongan magang
              </h3>
              <p className="text-gray-600">
                Coba ubah filter pencarian Anda atau cek kembali nanti.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {job.organization_logo ? (
                        <img
                          src={job.organization_logo}
                          alt={job.organization}
                          className="w-12 h-12 rounded-lg mr-4 object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 ${
                          job.organization_logo ? "hidden" : "flex"
                        }`}
                      >
                        <span className="text-blue-600 font-bold text-lg">
                          {job.organization?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-gray-600">{job.organization}</p>
                        {job.organization_industry && (
                          <p className="text-sm text-gray-500">
                            {job.organization_industry}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3 flex-wrap gap-2">
                      <span className="flex items-center">
                        <span className="mr-1">📍</span>
                        {job.address_locality}, {job.address_country}
                      </span>
                      {job.remote_derived && (
                        <span className="flex items-center">
                          <span className="mr-1">🏠</span>
                          Remote
                        </span>
                      )}
                      {/* Commented karena project khusus untuk intern
                      {job.employment_type && (
                        <span className="flex items-center">
                          <span className="mr-1">💼</span>
                          {formatEmploymentType(job.employment_type)}
                        </span>
                      )}
                      */}
                      {/* Commented karena project khusus untuk intern
                      {job.seniority && (
                        <span className="flex items-center">
                          <span className="mr-1">👤</span>
                          {job.seniority}
                        </span>
                      )}
                      */}
                    </div>

                    {job.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>Diposting {formatDate(job.date_posted)}</span>
                      {job.date_validthrough && (
                        <span className="ml-4">
                          Berlaku sampai {formatDate(job.date_validthrough)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    {job.remote_derived && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Remote
                      </div>
                    )}
                    {job.direct_apply && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Direct Apply
                      </div>
                    )}
                    {job.source && (
                      <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {job.source}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <span>
                      Sumber: {job.source_domain || job.source || "Unknown"}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetail(job)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleApply(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Lamar Sekarang
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        page === pagination.page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedJob && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedJob.title}
                </h2>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Company Info */}
                <div className="flex items-center">
                  {selectedJob.organization_logo ? (
                    <img
                      src={selectedJob.organization_logo}
                      alt={selectedJob.organization}
                      className="w-16 h-16 rounded-lg mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-xl">
                        {selectedJob.organization?.charAt(0) || "C"}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedJob.organization}
                    </h3>
                    {selectedJob.organization_industry && (
                      <p className="text-gray-600">
                        {selectedJob.organization_industry}
                      </p>
                    )}
                    {selectedJob.organization_headquarters && (
                      <p className="text-sm text-gray-500">
                        HQ: {selectedJob.organization_headquarters}
                      </p>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Informasi Lowongan
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posisi:</span>
                        <span className="font-medium text-gray-900">
                          {selectedJob.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lokasi:</span>
                        <span className="font-medium text-gray-900">
                          {selectedJob.address_locality},{" "}
                          {selectedJob.address_country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipe:</span>
                        <span className="font-medium text-gray-900">
                          {formatEmploymentType(selectedJob.employment_type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium text-gray-900">
                          {selectedJob.seniority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remote:</span>
                        <span className="font-medium text-gray-900">
                          {selectedJob.remote_derived ? "Ya" : "Tidak"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tanggal</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diposting:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(selectedJob.date_posted)}
                        </span>
                      </div>
                      {selectedJob.date_validthrough && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Berlaku sampai:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selectedJob.date_validthrough)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedJob.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Deskripsi
                    </h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {selectedJob.description}
                    </p>
                  </div>
                )}

                {/* Organization Description */}
                {selectedJob.organization_description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Tentang Perusahaan
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {selectedJob.organization_description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCloseDetail}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => handleApply(selectedJob)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Lamar Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Profil</h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Ubah Password (Opsional)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        value={editForm.currentPassword}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Masukkan password saat ini"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={editForm.newPassword}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Masukkan password baru"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password Baru
                      </label>
                      <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        placeholder="Konfirmasi password baru"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Cari Magang</h3>
            <p className="text-gray-400 mb-4">
              &quot;Platform perantara pencarian magang yang mendukung SDG 8
              untuk masa depan yang lebih baik.&quot;
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">
                Tentang Kami
              </a>
              <a href="#" className="hover:text-white">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-white">
                Syarat & Ketentuan
              </a>
              <a href="#" className="hover:text-white">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
