
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Store,
  MapPin,
  Phone,
  Mail,
  UserRound,
  ImagePlus,
  Share2,
  ExternalLink,
  Globe,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  EMPTY_VENDOR_PROFILE,
  getVendorProfile,
} from "@/lib/vendorProfile";

export default function VendorProfilePage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState(EMPTY_VENDOR_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const saved = getVendorProfile();

      if (saved) {
        setProfile({ ...EMPTY_VENDOR_PROFILE, ...saved });
      }

      setLoading(false);
    };

    load();
  }, []);

  const user = session?.user;

  const hasProfile = Boolean(
    profile.companyName || profile.ownerName || profile.email
  );

  const display = {
    ...profile,
    email: profile.email || user?.email || "",
    ownerName: profile.ownerName || user?.name || "",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your business profile as customers see it.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/profile/edit"
            className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eab536]"
          >
            <Pencil size={17} />
            Edit Profile
          </Link>
        </div>

        {/* Incomplete notice */}
        {!hasProfile && (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 sm:flex-row sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <AlertCircle size={22} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-[#FEC447]">
                Complete your business profile
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                Add your company details, photos and contact info so customers
                can find and trust your restaurant.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/profile/edit"
              className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#eab536]"
            >
              <Plus size={16} />
              Add Details
            </Link>
          </div>
        )}

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl">
          {/* Cover Image */}
          <div className="relative h-44 w-full bg-zinc-800">
            {display.coverImage ? (
              <img
                src={display.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-600">
                <ImagePlus size={32} className="mb-2 opacity-50" />
                <span className="text-xs">No cover image added</span>
              </div>
            )}

            {/* Logo Avatar */}
            <div className="absolute -bottom-10 left-6 h-20 w-20 overflow-hidden rounded-2xl border-4 border-zinc-900 bg-zinc-800 shadow-lg">
              {display.logo ? (
                <img
                  src={display.logo}
                  alt="Logo"
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
            <h2 className="text-2xl font-bold text-white">
              {display.companyName || "Your Restaurant Name"}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <UserRound size={14} className="text-[#FEC447]" />
              Owned by {display.ownerName || "Owner Name"}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              {display.description ||
                "Your restaurant description will appear here."}
            </p>

            {/* Contact & Location Info */}
            <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-2">
              <div className="flex items-start gap-3 text-sm text-zinc-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#FEC447]" />
                <div>
                  <p className="font-medium text-white">
                    {display.location || "City / Area"}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {display.address || "Full business address"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Phone size={16} className="shrink-0 text-[#FEC447]" />
                <span>{display.phone || "+880 1XXXXXXXXX"}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-300 sm:col-span-2">
                <Mail size={16} className="shrink-0 text-[#FEC447]" />
                <span className="truncate">
                  {display.email || "restaurant@example.com"}
                </span>
              </div>
            </div>

            {/* Social Links */}
            {(display.facebook || display.instagram || display.website) && (
              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-zinc-800 pt-5">
                {display.facebook && (
                  <a
                    href={display.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#FEC447] hover:text-[#FEC447]"
                  >
                    <Share2 size={14} />
                    Facebook
                  </a>
                )}
                {display.instagram && (
                  <a
                    href={display.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#FEC447] hover:text-[#FEC447]"
                  >
                    <Share2 size={14} />
                    Instagram
                  </a>
                )}
                {display.website && (
                  <a
                    href={display.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/70 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-[#FEC447] hover:text-[#FEC447]"
                  >
                    <ExternalLink size={14} />
                    Website
                  </a>
                )}
              </div>
            )}

            {!(display.facebook || display.instagram || display.website) && (
              <div className="mt-6 flex items-center gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
                <Globe size={14} className="text-[#FEC447]" />
                No social links added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
