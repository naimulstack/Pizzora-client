
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Pizza,
  ArrowLeft,
  ImagePlus,
  Upload,
  X,
  Plus,
  Clock,
  Tag,
  Utensils,
} from "lucide-react";

const categories = [
  "Classic Pizza",
  "Chicken Pizza",
  "Beef Pizza",
  "Seafood Pizza",
  "Vegetarian Pizza",
  "Special Pizza",
];

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

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-zinc-800 bg-[#18181b] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#FEC447]";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      image: value,
    }));

    setImagePreview(value);
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

    // API connection will be added in the next step.
    toast.success("Pizza form completed! API connection is pending.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="mb-8">
        <Link
          href="/dashboard/vendor/pizzas"
          className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#FEC447]"
        >
          <ArrowLeft size={17} />
          Back to My Pizzas
        </Link>

        <h1 className="text-3xl font-bold">Add New Pizza</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add your delicious pizza and submit it for admin approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl space-y-7">

        {/* Basic Information */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Pizza className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Basic Information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-zinc-300">
                Pizza Name *
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Special Chicken Pizza"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Category *
              </label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Preparation Time *
              </label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  required
                  type="number"
                  min="1"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  placeholder="e.g. 25 minutes"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-300">
              Pizza Description *
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your delicious pizza..."
              className={inputClass}
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Tag className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Pricing Information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">
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
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">
                Discount Price (৳)
              </label>
              <input
                type="number"
                min="1"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Optional"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Pizza Image */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <ImagePlus className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Pizza Image</h2>
          </div>

          <label className="mb-2 block text-sm text-zinc-300">
            Image URL *
          </label>

          <input
            required
            type="url"
            name="image"
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Paste your uploaded image URL"
            className={inputClass}
          />

          <p className="mt-2 text-xs text-zinc-500">
            Use a direct image URL. We will add ImgBB upload functionality later.
          </p>

          {imagePreview && (
            <div className="relative mt-5 w-fit">
              <img
                src={imagePreview}
                alt="Pizza preview"
                className="h-48 w-64 rounded-xl border border-zinc-700 object-cover"
                onError={() => setImagePreview("")}
              />

              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setFormData((prev) => ({ ...prev, image: "" }));
                }}
                className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 text-white"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </section>

        {/* Ingredients and Sizes */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Utensils className="text-[#FEC447]" size={23} />
            <h2 className="text-xl font-bold">Ingredients & Sizes</h2>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Ingredients *
            </label>
            <textarea
              required
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              placeholder="Mozzarella, Chicken, Tomato, Onion, Cheese..."
              className={inputClass}
            />
          </div>

          <div className="mt-6">
            <label className="mb-3 block text-sm text-zinc-300">
              Available Sizes *
            </label>

            <div className="flex flex-wrap gap-3">
              {["Regular", "Medium", "Large", "Extra Large"].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`rounded-xl border px-5 py-3 text-sm font-medium transition ${
                    formData.sizes.includes(size)
                      ? "border-[#FEC447] bg-[#FEC447]/10 text-[#FEC447]"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Availability and Location */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8">
          <h2 className="mb-6 text-xl font-bold">Availability & Location</h2>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Pizza Location *
            </label>
            <input
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Agrabad, Chattogram"
              className={inputClass}
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
            <span className="text-sm text-zinc-300">
              This pizza is currently available for orders.
            </span>
          </label>
        </section>

        {/* Approval Notice */}
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 shrink-0 text-[#FEC447]" size={20} />
            <div>
              <h3 className="font-semibold text-[#FEC447]">
                Admin Approval Required
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Your pizza will remain Pending until an admin reviews and
                approves it. Once approved, it will become visible on the
                Pizzora website.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href="/dashboard/vendor/pizzas"
            className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
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
    </div>
  );
}
