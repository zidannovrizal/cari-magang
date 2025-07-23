"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [popularJobs, setPopularJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularJobs();
  }, []);

  const fetchPopularJobs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/job-board/popular`
      );
      const data = await response.json();

      if (data.success) {
        setPopularJobs(data.data);
      }
    } catch (error) {
      console.error("Error fetching popular jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRemoteStatus = (remote) => {
    if (remote === true)
      return { text: "Remote", class: "bg-green-100 text-green-800" };
    if (remote === false)
      return { text: "Onsite", class: "bg-purple-100 text-purple-800" };
    return { text: "Hybrid", class: "bg-blue-100 text-blue-800" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Masuk
              </button>
              <button
                onClick={handleRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🎯 SDG 8 - Decent Work & Economic Growth
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Temukan Magang
              <span className="text-blue-600"> Impianmu</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              "Platform pencarian magang yang menghubungkan mahasiswa dengan
              perusahaan terbaik. Fokus pada pekerjaan layak dan pertumbuhan
              ekonomi berkelanjutan."
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleRegister}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Perusahaan Mitra</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                2,000+
              </div>
              <div className="text-gray-600">Lowongan Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Mahasiswa Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Tingkat Penempatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Cari Magang yang Sesuai
            </h2>
            <div className="text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-yellow-600 text-2xl mr-2">🔒</div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Masuk Diperlukan
                  </h3>
                </div>
                <p className="text-yellow-700 mb-4">
                  "Silakan masuk terlebih dahulu untuk mengakses fitur pencarian
                  magang yang lengkap dan personal."
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Masuk Sekarang
                  </button>
                  <button
                    onClick={handleRegister}
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Daftar Gratis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Lowongan Terpopuler
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : popularJobs.length > 0 ? (
            <div className="space-y-4">
              {popularJobs.map((job) => (
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
                        <span className="flex items-center">
                          <span className="mr-1">💼</span>
                          Internship
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>Diposting {formatDate(job.date_posted)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {job.remote_derived && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Remote
                        </div>
                      )}
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Internship
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>
                        Sumber:{" "}
                        {job.source_domain ||
                          job.source ||
                          job.source_type ||
                          "Job Board"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Masuk untuk Melamar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Tidak ada lowongan tersedia saat ini
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SDG 8 Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Mendukung SDG 8: Decent Work & Economic Growth
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              "Kami berkomitmen untuk menghubungkan mahasiswa dengan peluang
              magang yang berkualitas, mendukung pertumbuhan ekonomi
              berkelanjutan dan pekerjaan yang layak untuk semua."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Decent Work</h3>
                <p className="text-blue-100">
                  "Memastikan setiap magang memberikan pengalaman belajar yang
                  bermakna"
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Economic Growth</h3>
                <p className="text-blue-100">
                  "Mendorong pertumbuhan ekonomi melalui talent development"
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                <p className="text-blue-100">
                  "Menjembatani gap antara dunia pendidikan dan industri"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cari Magang</h3>
              <p className="text-gray-400">
                "Platform pencarian magang terdepan yang mendukung SDG 8 untuk
                masa depan yang lebih baik."
              </p>
            </div>
            <div></div>
            {/* <div>
              <h4 className="text-lg font-semibold mb-4">Untuk Mahasiswa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white cursor-not-allowed relative"
                    onClick={(e) => e.preventDefault()}
                    title="Coming soon"
                    tabIndex={-1}
                  >
                    Cari Magang
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-800 text-xs text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white cursor-not-allowed relative"
                    onClick={(e) => e.preventDefault()}
                    title="Coming soon"
                    tabIndex={-1}
                  >
                    Tips Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white cursor-not-allowed relative"
                    onClick={(e) => e.preventDefault()}
                    title="Coming soon"
                    tabIndex={-1}
                  >
                    Resume Builder
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white cursor-not-allowed relative"
                    onClick={(e) => e.preventDefault()}
                    title="Coming soon"
                    tabIndex={-1}
                  >
                    Interview Prep
                  </a>
                </li>
              </ul>
            </div> */}
            <div></div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 hello@carimagang.com</li>
                <li>📞 +62 21 1234 5678</li>
                <li>📍 Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Cari Magang. Created by Zidan Novrizal. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
