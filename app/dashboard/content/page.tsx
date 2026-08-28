'use client';

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";

export default function ContentManagementPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<"umum" | "hero" | "tentang" | "keunggulan">("umum");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch (error) {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan perubahan");
      }

      toast.success("Konten website berhasil diperbarui! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-700 border-t-transparent"></div>
        <p className="mt-3 text-neutral-600 text-sm">Memuat editor konten...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-cream-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary-900">
            Kelola Konten & Halaman
          </h1>
          <p className="text-neutral-600 text-xs sm:text-sm mt-0.5">
            Ubah teks, deskripsi, cerita, nomor kontak, dan informasi toko pada masing-masing halaman.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6 shadow-warm-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {/* Navigation Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-cream-200 no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab("umum")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap flex-shrink-0 ${
            activeTab === "umum"
              ? "bg-primary-800 text-cream-50 shadow-warm-sm"
              : "bg-white text-neutral-700 border border-cream-300 hover:bg-cream-100"
          }`}
        >
          🏢 Info Toko & Kontak
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap flex-shrink-0 ${
            activeTab === "hero"
              ? "bg-primary-800 text-cream-50 shadow-warm-sm"
              : "bg-white text-neutral-700 border border-cream-300 hover:bg-cream-100"
          }`}
        >
          ✨ Beranda / Hero
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tentang")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap flex-shrink-0 ${
            activeTab === "tentang"
              ? "bg-primary-800 text-cream-50 shadow-warm-sm"
              : "bg-white text-neutral-700 border border-cream-300 hover:bg-cream-100"
          }`}
        >
          📖 Tentang Kami
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("keunggulan")}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap flex-shrink-0 ${
            activeTab === "keunggulan"
              ? "bg-primary-800 text-cream-50 shadow-warm-sm"
              : "bg-white text-neutral-700 border border-cream-300 hover:bg-cream-100"
          }`}
        >
          🏆 Keunggulan & Kualitas
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-cream-300 shadow-warm-md p-6 sm:p-8 space-y-6">
        {/* Tab 1: Info Toko & Kontak */}
        {activeTab === "umum" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-bold text-xl text-primary-900 border-b border-cream-200 pb-2">
              Informasi Umum & Halaman Kontak
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nama Toko / Brand *
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Tagline / Subtitle Toko
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Nomor WhatsApp Pemesanan *
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Alamat Email Resmi *
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Alamat Fisik / Dapur Toko *
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Jam Buka / Operasional
                </label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={(e) => handleChange("openingHours", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Teks Pengumuman Top Bar (Paling Atas Website)
              </label>
              <textarea
                rows={2}
                value={settings.announcement}
                onChange={(e) => handleChange("announcement", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Beranda / Hero */}
        {activeTab === "hero" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-bold text-xl text-primary-900 border-b border-cream-200 pb-2">
              Konten Header & Hero Utama Beranda
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Badge Subhead (Di Atas Judul Utama)
              </label>
              <input
                type="text"
                value={settings.heroBadge}
                onChange={(e) => handleChange("heroBadge", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Headline Utama (Baris 1)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Headline Aksen Italic (Baris 2)
                </label>
                <input
                  type="text"
                  value={settings.heroTitleItalic}
                  onChange={(e) => handleChange("heroTitleItalic", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50 font-serif italic"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Deskripsi Singkat Hero
              </label>
              <textarea
                rows={3}
                value={settings.heroDescription}
                onChange={(e) => handleChange("heroDescription", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Tentang Kami */}
        {activeTab === "tentang" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-bold text-xl text-primary-900 border-b border-cream-200 pb-2">
              Konten Halaman &amp; Section Tentang Kami
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Label / Badge Section
                </label>
                <input
                  type="text"
                  value={settings.aboutBadge}
                  onChange={(e) => handleChange("aboutBadge", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Judul Utama Cerita
                </label>
                <input
                  type="text"
                  value={settings.aboutTitle}
                  onChange={(e) => handleChange("aboutTitle", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Paragraf Cerita 1
              </label>
              <textarea
                rows={3}
                value={settings.aboutParagraph1}
                onChange={(e) => handleChange("aboutParagraph1", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Paragraf Cerita 2
              </label>
              <textarea
                rows={3}
                value={settings.aboutParagraph2}
                onChange={(e) => handleChange("aboutParagraph2", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                Kutipan / Quote Filosofi Toko
              </label>
              <input
                type="text"
                value={settings.aboutQuote}
                onChange={(e) => handleChange("aboutQuote", e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50 italic"
              />
            </div>

            <div className="pt-3 border-t border-cream-200">
              <h4 className="text-xs uppercase font-bold tracking-wider text-accent-amber mb-3">
                3 Pilar Kualitas (Nomor 01, 02, 03)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 space-y-2">
                  <span className="font-bold text-sm text-primary-900">Pilar 01</span>
                  <input
                    type="text"
                    placeholder="Judul Pilar 1"
                    value={settings.pillar1Title}
                    onChange={(e) => handleChange("pillar1Title", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Pilar 1"
                    value={settings.pillar1Desc}
                    onChange={(e) => handleChange("pillar1Desc", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300"
                  />
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 space-y-2">
                  <span className="font-bold text-sm text-primary-900">Pilar 02</span>
                  <input
                    type="text"
                    placeholder="Judul Pilar 2"
                    value={settings.pillar2Title}
                    onChange={(e) => handleChange("pillar2Title", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Pilar 2"
                    value={settings.pillar2Desc}
                    onChange={(e) => handleChange("pillar2Desc", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300"
                  />
                </div>

                <div className="p-3 bg-cream-50 rounded-xl border border-cream-200 space-y-2">
                  <span className="font-bold text-sm text-primary-900">Pilar 03</span>
                  <input
                    type="text"
                    placeholder="Judul Pilar 3"
                    value={settings.pillar3Title}
                    onChange={(e) => handleChange("pillar3Title", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Pilar 3"
                    value={settings.pillar3Desc}
                    onChange={(e) => handleChange("pillar3Desc", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Keunggulan */}
        {activeTab === "keunggulan" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="font-display font-bold text-xl text-primary-900 border-b border-cream-200 pb-2">
              Konten Halaman &amp; Section Keunggulan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={settings.advantagesBadge}
                  onChange={(e) => handleChange("advantagesBadge", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Judul Section Keunggulan
                </label>
                <input
                  type="text"
                  value={settings.advantagesTitle}
                  onChange={(e) => handleChange("advantagesTitle", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-cream-300 focus:ring-2 focus:ring-primary-500 outline-none bg-cream-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-accent-amber">Keunggulan 1</span>
                <input
                  type="text"
                  placeholder="Judul Keunggulan 1"
                  value={settings.feature1Title}
                  onChange={(e) => handleChange("feature1Title", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                />
                <textarea
                  rows={4}
                  placeholder="Deskripsi Keunggulan 1"
                  value={settings.feature1Desc}
                  onChange={(e) => handleChange("feature1Desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 leading-relaxed"
                />
              </div>

              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-accent-amber">Keunggulan 2</span>
                <input
                  type="text"
                  placeholder="Judul Keunggulan 2"
                  value={settings.feature2Title}
                  onChange={(e) => handleChange("feature2Title", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                />
                <textarea
                  rows={4}
                  placeholder="Deskripsi Keunggulan 2"
                  value={settings.feature2Desc}
                  onChange={(e) => handleChange("feature2Desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 leading-relaxed"
                />
              </div>

              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-accent-amber">Keunggulan 3</span>
                <input
                  type="text"
                  placeholder="Judul Keunggulan 3"
                  value={settings.feature3Title}
                  onChange={(e) => handleChange("feature3Title", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                />
                <textarea
                  rows={4}
                  placeholder="Deskripsi Keunggulan 3"
                  value={settings.feature3Desc}
                  onChange={(e) => handleChange("feature3Desc", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-cream-300 leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-cream-200 space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-primary-900">
                Box Jaminan Halal & Higienis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Judul Jaminan</label>
                  <input
                    type="text"
                    value={settings.halalBoxTitle}
                    onChange={(e) => handleChange("halalBoxTitle", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Deskripsi Jaminan</label>
                  <textarea
                    rows={2}
                    value={settings.halalBoxDesc}
                    onChange={(e) => handleChange("halalBoxDesc", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-cream-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button Bottom */}
        <div className="pt-5 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-xs uppercase tracking-wider py-3 px-8 shadow-warm-md disabled:opacity-50"
          >
            {isSaving ? "Menyimpan Perubahan..." : "Simpan Semua Konten"}
          </button>
        </div>
      </form>
    </div>
  );
}
