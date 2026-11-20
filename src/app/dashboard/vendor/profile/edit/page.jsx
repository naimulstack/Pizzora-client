
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  UserRound,
  Store,
  MapPin,
  Phone,
  Mail,
  ImagePlus,
  Globe,
  Save,
  Share2,
  ExternalLink,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  EMPTY_VENDOR_PROFILE,
  getVendorProfile,
  saveVendorProfile,
} from "@/lib/vendorProfile";

export default function EditVendorProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState(EMPTY_VENDOR_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const saved = getVendorProfile();

      if (saved) {
        setFormData({ ...EMPTY_VENDOR_PROFILE, ...saved });
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      saveVendorProfile(formData);
      toast.success("Profile updated successfully!");
      router.push("/dashboard/vendor/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-surface bg-card-surface px-4 py-3 text-sm text-content outline-none transition placeholder:text-muted-content focus:border-[#FEC447]";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-[#FEC447]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/vendor/profile"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-content transition hover:text-[#FEC447]"
        >
          <ArrowLeft size={17} />
          Back to My Profile
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Edit Business Profile</h1>
            <p className="mt-2 text-sm text-muted-content">
              Update your restaurant information and business details.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/profile"
            className="flex items-center gap-2 rounded-xl border border-surface px-5 py-3 text-sm font-semibold text-content transition hover:bg-card-surface"
          >
            Cancel
          </Link>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Form */}
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-7">
          {/* Company Information */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Store className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Company Information</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-content">
                  Company Name *
                </label>
                <input
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your Restaurant Name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Owner Name *
                </label>
                <input
                  required
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Business Email *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="restaurant@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXXXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Business Images */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <ImagePlus className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Business Images</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-content">
                  Company Logo URL
                </label>
                <input
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="Paste your logo image URL"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Cover Image URL
                </label>
                <input
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Paste your cover image URL"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <MapPin className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Business Location</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-content">
                  City / Area *
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chattogram"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Full Business Address *
                </label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your complete restaurant address"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">About Your Business</h2>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Tell customers about your restaurant..."
              className={inputClass}
            />
          </section>

          {/* Social Links */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Globe className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Social Media & Website</h2>
            </div>

            <div className="space-y-5">
              {[
                ["facebook", "Facebook URL"],
                ["instagram", "Instagram URL"],
                ["website", "Website URL"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm text-content">
                    {label}
                  </label>
                  <input
                    type="url"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`https://${name}.com/...`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-wrap items-center justify-end gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-7 py-3 font-bold text-black transition hover:bg-[#eab536] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        {/* Right Side: Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-content">
                Live Profile Preview
              </span>
              <span className="rounded-full bg-[#FEC447]/10 px-3 py-1 text-xs font-medium text-[#FEC447]">
                Customer View
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface bg-card-surface/80 shadow-xl">
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-card-surface">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-muted-content">
                    <ImagePlus size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">Cover Image Preview</span>
                  </div>
                )}

                {/* Logo Avatar */}
                <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-2xl border-4 border-zinc-900 bg-card-surface shadow-lg">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Logo Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#FEC447]">
                      <Store size={30} />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6 pt-14">
                {/* Title & Owner */}
                <div>
                  <h3 className="text-xl font-bold text-content">
                    {formData.companyName || "Your Restaurant Name"}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-content">
                    <UserRound size={14} className="text-[#FEC447]" />
                    Owned by {formData.ownerName || "Owner Name"}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-content">
                  {formData.description ||
                    "Your restaurant description will appear here. Tell your customers what makes your food and service special."}
                </p>

                {/* Contact & Location Info */}
                <div className="mt-6 space-y-3 border-t border-surface pt-5 text-sm">
                  <div className="flex items-start gap-3 text-content">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#FEC447]"
                    />
                    <div>
                      <p className="font-medium text-content">
                        {formData.location || "City / Area"}
                      </p>
                      <p className="text-xs text-muted-content">
                        {formData.address ||
                          "Full business address will show here"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-content">
                    <Phone size={16} className="shrink-0 text-[#FEC447]" />
                    <span>{formData.phone || "+880 1XXXXXXXXX"}</span>
                  </div>

                  <div className="flex items-center gap-3 text-content">
                    <Mail size={16} className="shrink-0 text-[#FEC447]" />
                    <span className="truncate">
                      {formData.email || "restaurant@example.com"}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {(formData.facebook ||
                  formData.instagram ||
                  formData.website) && (
                  <div className="mt-6 flex flex-wrap gap-2.5 border-t border-surface pt-5">
                    {formData.facebook && (
                      <a
                        href={formData.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-surface bg-card-surface/70 px-3 py-1.5 text-xs text-content transition hover:border-[#FEC447] hover:text-[#FEC447]"
                      >
                        <Share2 size={14} />
                        Facebook
                      </a>
                    )}
                    {formData.instagram && (
                      <a
                        href={formData.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-surface bg-card-surface/70 px-3 py-1.5 text-xs text-content transition hover:border-[#FEC447] hover:text-[#FEC447]"
                      >
                        <Share2 size={14} />
                        Instagram
                      </a>
                    )}
                    {formData.website && (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-surface bg-card-surface/70 px-3 py-1.5 text-xs text-content transition hover:border-[#FEC447] hover:text-[#FEC447]"
                      >
                        <ExternalLink size={14} />
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
