"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  Store,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const VENDOR_FEE = 3000;
const PREVIEW_STORAGE_KEY = "pizzora_vendor_application_preview";
const SUBMITTED_REQ_STORAGE_KEY = "pizzora_vendor_submitted_request";

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none placeholder:text-muted-content focus:border-orange-500";

const BUSINESS_TYPES = [
  "Restaurant",
  "Cloud Kitchen",
  "Home Kitchen",
  "Cafe & Pizzeria",
];

export default function BecomeVendorPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [navigating, setNavigating] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    nidNumber: "",
    nidDocumentUrl: "",
    shopName: "",
    businessType: "Restaurant",
    tradeLicenseNumber: "",
    kitchenPhotoUrl: "",
    operatingHours: "",
    cityArea: "",
    fullAddress: "",
    note: "",
    agreedToTerms: false,
  });

  useEffect(() => {
    let active = true;

    const loadUserAndRequests = async () => {
      setLoadingSession(true);
      try {
        const sessionRes = await authClient.getSession?.().catch(() => null);
        const currentUser = sessionRes?.data?.user || sessionRes?.user || null;

        if (!active) return;
        setUser(currentUser);

        if (currentUser) {
          setFormData((prev) => ({
            ...prev,
            ownerName: prev.ownerName || currentUser.name || "",
            email: prev.email || currentUser.email || "",
          }));
        }

        if (currentUser?.email) {
          const reqRes = await fetch(
            `${API_URL}/vendor-requests?email=${encodeURIComponent(
              currentUser.email
            )}`,
            {
              credentials: "include",
              cache: "no-store",
            }
          ).catch(() => null);

          if (reqRes?.ok && active) {
            const list = await reqRes.json().catch(() => []);
            const requests = Array.isArray(list) ? list : [];

            // ইতিমধ্যে pending বা approved রিকোয়েস্ট থাকলে আর আবেদন করতে দেবে না -> checkout-success এ পাঠাবে
            const existingRequest = requests.find(
              (r) => r.status === "pending" || r.status === "approved"
            );

            if (existingRequest) {
              try {
                sessionStorage.setItem(
                  SUBMITTED_REQ_STORAGE_KEY,
                  JSON.stringify(existingRequest)
                );
              } catch {
                // ignore storage error
              }
              router.replace(
                `/become-vendor/checkout-success?status=${encodeURIComponent(
                  existingRequest.status || "pending"
                )}&requestId=${encodeURIComponent(existingRequest._id || "")}`
              );
              return;
            }
          }
        }
      } finally {
        if (active) setLoadingSession(false);
      }
    };

    loadUserAndRequests();
    return () => {
      active = false;
    };
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please sign in first to apply as a vendor.");
      return;
    }

    if (!formData.agreedToTerms) {
      toast.error("Please confirm that your verification details are genuine.");
      return;
    }

    setNavigating(true);

    try {
      const payload = {
        ...formData,
        userId: user.id || user._id || "",
        userEmail: (formData.email || user.email || "").trim().toLowerCase(),
        userName: formData.ownerName || user.name || "Customer",
        vendorFee: VENDOR_FEE,
      };

      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(payload));
      router.push("/become-vendor/checkout");
    } catch {
      setNavigating(false);
      toast.error("Could not prepare checkout preview. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-sm font-medium text-orange-400">
            Pizzora / Partner Verification
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Become a Verified Vendor
          </h1>
          <p className="mt-2 text-sm text-muted-content">
            Submit genuine owner and kitchen verification details so our team can
            approve authentic pizzerias and kitchens.
          </p>
        </div>

        {loadingSession ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-8 text-sm text-muted-content">
            Checking your account and application status...
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-surface bg-card-surface/50 p-8">
            <h2 className="text-lg font-bold">Sign in Required</h2>
            <p className="mt-2 text-sm text-muted-content">
              Please sign in with your account first so we can link your vendor
              application to your profile.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-orange-400"
            >
              Go to Login
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleContinueToPayment}
            className="space-y-8 rounded-2xl border border-surface bg-card-surface/50 p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface pb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                  <Store size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Vendor Verification Form</h2>
                  <p className="text-xs text-muted-content">
                    All verification fields help us confirm real kitchens
                  </p>
                </div>
              </div>
              <span className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
                Onboarding Fee: ৳{VENDOR_FEE.toLocaleString()}
              </span>
            </div>

            {/* Section 1: Owner Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
                <ShieldCheck size={17} />
                <span>1. Owner Identity &amp; Contact</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-content">
                    Owner Full Name (As per NID) *
                  </label>
                  <input
                    required
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Naimul Huda Jihan"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    Official Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vendor@example.com"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    Active Phone Number *
                  </label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    NID / Passport Number *
                  </label>
                  <input
                    required
                    name="nidNumber"
                    value={formData.nidNumber}
                    onChange={handleChange}
                    placeholder="10 or 17 digit NID number"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-content">
                    NID Front Photo / Verification Document URL *
                  </label>
                  <input
                    required
                    type="url"
                    name="nidDocumentUrl"
                    value={formData.nidDocumentUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/nid-front.jpg"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Business & Kitchen Proof */}
            <div className="space-y-4 border-t border-surface pt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
                <Store size={17} />
                <span>2. Business &amp; Kitchen Proof</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-content">
                    Kitchen / Restaurant Name *
                  </label>
                  <input
                    required
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="e.g. OvenCraft Pizzeria"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={INPUT_CLASS}
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-content">
                    Trade License / TIN Number *
                  </label>
                  <input
                    required
                    name="tradeLicenseNumber"
                    value={formData.tradeLicenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. TRAD/CTG/004512"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    Operating Hours *
                  </label>
                  <input
                    required
                    name="operatingHours"
                    value={formData.operatingHours}
                    onChange={handleChange}
                    placeholder="e.g. 11:00 AM - 11:00 PM"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-content">
                    Kitchen / Storefront Photo URL *
                  </label>
                  <input
                    required
                    type="url"
                    name="kitchenPhotoUrl"
                    value={formData.kitchenPhotoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/my-kitchen.jpg"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pickup Location & Notes */}
            <div className="space-y-4 border-t border-surface pt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
                <MapPin size={17} />
                <span>3. Pickup Location &amp; Menu Notes</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-content">City / Area *</label>
                  <input
                    required
                    name="cityArea"
                    value={formData.cityArea}
                    onChange={handleChange}
                    placeholder="e.g. Agrabad, Chattogram"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="text-sm text-content">
                    Full Pickup Street Address *
                  </label>
                  <input
                    required
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    placeholder="House/Holding, Road, Block, Landmark"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-content">
                    Pizza Specialty / Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Tell us about your signature pizzas, hygiene standards, or social/map links..."
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-2 text-xs text-muted-content">
                <input
                  required
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-orange-500"
                />
                <span>
                  I confirm that the NID, business license, and kitchen details
                  provided above are authentic and belong to me.
                </span>
              </label>
            </div>

            <div className="flex justify-end border-t border-surface pt-5">
              <button
                type="submit"
                disabled={navigating}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-50"
              >
                {navigating
                  ? "Opening Preview..."
                  : `Continue to Payment (৳${VENDOR_FEE})`}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}