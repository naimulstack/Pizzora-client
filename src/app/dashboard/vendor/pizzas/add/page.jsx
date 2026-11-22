"use client";

import { useState } from "react";
import { authFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  Pizza,
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
  Clock,
  Tag,
  Utensils,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const CATEGORIES = [
  "Classic Pizza",
  "Chicken Pizza",
  "Beef Pizza",
  "Seafood Pizza",
  "Vegetarian Pizzas",
  "Special Pizza",
];

const SIZES = ["Regular", "Medium", "Large", "Extra Large"];

const INPUT_CLASS =
  "w-full rounded-xl border border-surface bg-card-surface px-4 py-3 text-sm text-content outline-none placeholder:text-muted-content focus:border-[#FEC447]";

export default function AddPizzaPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    image: "",
    description: "",
    ingredients: "",
    sizes: ["Regular"],
    preparationTime: "",
    location: "",
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.sizes.length === 0) {
      toast.error("Please select at least one pizza size.");
      return;
    }

    if (
      formData.discountPrice &&
      Number(formData.discountPrice) >= Number(formData.price)
    ) {
      toast.error("Discount price must be lower than regular price.");
      return;
    }

    setLoading(true);

    try {
      const [sessionData, tokenData] = await Promise.all([
        authClient.getSession?.().catch(() => null),
        authClient.token?.().catch(() => null),
      ]);

      const user = sessionData?.data?.user || sessionData?.user || {};
      const token = tokenData?.data?.token || tokenData?.token;

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : null,
        preparationTime: Number(formData.preparationTime),
        vendorId: user.id || "",
        vendorEmail: user.email || "",
        vendorName: user.name || "",
        vendor: user.companyName || user.name || "Pizzora Vendor",
        status: "pending",
        isActive: true,
      };

      const res = await authFetch(`/vendor/pizzas`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Pizza submission failed");
      }

      toast.success("Pizza submitted! Status: Pending");
      router.push("/dashboard/vendor/pizzas");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const ingredientList = formData.ingredients
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mb-8">
        <Link
          href="/dashboard/vendor/pizzas"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-content hover:text-[#FEC447]"
        >
          <ArrowLeft size={17} />
          Back to My Pizzas
        </Link>

        <h1 className="text-3xl font-bold">Add New Pizza</h1>
        <p className="mt-2 text-sm text-muted-content">
          Add your pizza and submit it for admin approval.
        </p>
      </div>

      {/* Main Split Layout: Form on Left, Live Preview on Right */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Side: Form */}
        <form onSubmit={handleSubmit} className="space-y-7 lg:col-span-7">
          {/* Basic Information */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Pizza className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Basic Information</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-content">
                  Pizza Name *
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Special Chicken Pizza"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Category *
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Preparation Time (mins) *
                </label>
                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-content"
                  />
                  <input
                    required
                    type="number"
                    min="1"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    placeholder="25"
                    className={`${INPUT_CLASS} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-content">
                Pizza Description *
              </label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your pizza..."
                className={INPUT_CLASS}
              />
            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Tag className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Pricing Information</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-content">
                  Regular Price (৳) *
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="450"
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-content">
                  Discount Price (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </section>

          {/* Pizza Image */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <ImagePlus className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Pizza Image</h2>
            </div>

            <label className="mb-2 block text-sm text-content">
              Image URL *
            </label>
            <input
              required
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/pizza.jpg"
              className={INPUT_CLASS}
            />

            {formData.image && (
              <div className="relative mt-5 w-fit">
                <img
                  src={formData.image}
                  alt="Pizza preview"
                  className="h-48 w-64 rounded-xl border border-surface object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                  className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 text-white"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </section>

          {/* Ingredients and Sizes */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Utensils className="text-[#FEC447]" size={23} />
              <h2 className="text-xl font-bold">Ingredients &amp; Sizes</h2>
            </div>

            <div>
              <label className="mb-2 block text-sm text-content">
                Ingredients *
              </label>
              <textarea
                required
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows={3}
                placeholder="Mozzarella, Chicken, Tomato, Onion..."
                className={INPUT_CLASS}
              />
            </div>

            <div className="mt-6">
              <label className="mb-3 block text-sm text-content">
                Available Sizes *
              </label>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                      formData.sizes.includes(size)
                        ? "border-[#FEC447] bg-[#FEC447]/10 text-[#FEC447]"
                        : "border-surface text-muted-content hover:border-zinc-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Availability and Location */}
          <section className="rounded-2xl border border-surface bg-card-surface/60 p-6 md:p-8">
            <h2 className="mb-6 text-xl font-bold">
              Availability &amp; Location
            </h2>

            <div>
              <label className="mb-2 block text-sm text-content">
                Pizza Location *
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Agrabad, Chattogram"
                className={INPUT_CLASS}
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4 accent-[#FEC447]"
              />
              <span className="text-sm text-content">
                This pizza is currently available for orders.
              </span>
            </label>
          </section>

          {/* Submit */}
          <div className="flex flex-wrap justify-end gap-3">
            <Link
              href="/dashboard/vendor/pizzas"
              className="rounded-xl border border-surface px-6 py-3 text-sm font-semibold text-content hover:bg-card-surface"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#FEC447] px-7 py-3 font-bold text-black transition hover:bg-[#eab536] disabled:opacity-50"
            >
              <Upload size={18} />
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>

        {/* Right Side: Live Pizza Preview Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-content">
                Live Pizza Preview
              </span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-[#FEC447]">
                Pending Approval
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface bg-card-surface/80 shadow-xl">
              {/* Image Section */}
              <div className="relative h-56 w-full bg-card-surface">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name || "Pizza Preview"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-muted-content">
                    <Pizza size={38} className="mb-2 opacity-50" />
                    <span className="text-xs">Pizza Image Preview</span>
                  </div>
                )}

                {/* Availability Badge */}
                <div className="absolute left-4 top-4">
                  {formData.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <CheckCircle2 size={13} />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <XCircle size={13} />
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-lg bg-surface-deep/85 px-3 py-1 text-xs font-medium text-[#FEC447] backdrop-blur-sm">
                    {formData.category || "Category"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Title & Prep Time */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-content">
                    {formData.name || "Your Pizza Name"}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-surface bg-surface-deep/60 px-2.5 py-1 text-xs text-content">
                    <Clock size={13} className="text-[#FEC447]" />
                    {formData.preparationTime
                      ? `${formData.preparationTime} min`
                      : "25 min"}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2.5">
                  {formData.discountPrice ? (
                    <>
                      <span className="text-2xl font-extrabold text-[#FEC447]">
                        ৳{formData.discountPrice}
                      </span>
                      <span className="text-sm text-muted-content line-through">
                        ৳{formData.price || "0"}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-[#FEC447]">
                      ৳{formData.price || "0"}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-content">
                  {formData.description ||
                    "Your pizza description will appear here. Highlight the crust, sauce, and toppings."}
                </p>

                {/* Sizes */}
                <div className="mt-5 border-t border-surface pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-content">
                    Available Sizes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.length > 0 ? (
                      formData.sizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-lg border border-surface bg-card-surface/70 px-2.5 py-1 text-xs text-content"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-content">
                        No size selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mt-5 border-t border-surface pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-content">
                    Ingredients
                  </p>
                  {ingredientList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {ingredientList.map((item, idx) => (
                        <span
                          key={`${item}-${idx}`}
                          className="rounded-md bg-card-surface px-2.5 py-1 text-xs text-content"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-content">
                      Mozzarella, Chicken, Tomato, Onion...
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="mt-5 flex items-center gap-2 border-t border-surface pt-4 text-xs text-muted-content">
                  <MapPin size={14} className="shrink-0 text-[#FEC447]" />
                  <span>{formData.location || "Pizza Location"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}