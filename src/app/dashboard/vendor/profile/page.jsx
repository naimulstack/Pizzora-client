
"use client";

import { useState } from "react";
import {
  UserRound,
  Store,
  MapPin,
  Phone,
  Mail,
  ImagePlus,
  Globe,
  Save,
} from "lucide-react";

export default function VendorProfilePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    logo: "",
    coverImage: "",
    location: "",
    address: "",
    description: "",
    facebook: "",
    instagram: "",
    website: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Profile form is ready. Database connection is the next step.");
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-800 bg-[#18181b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#FEC447]";

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage your restaurant information and business details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl space-y-8">

        {/* Company Information */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Store className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Company Information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <ImagePlus className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Business Images</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <MapPin className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Business Location</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
              <label className="mb-2 block text-sm text-zinc-300">
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
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
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
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
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
                <label className="mb-2 block text-sm text-zinc-300">
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {message && (
              <p className="text-sm text-[#FEC447]">{message}</p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-7 py-3 font-bold text-black transition hover:bg-[#eab536]"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
