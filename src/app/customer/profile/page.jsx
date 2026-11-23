"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { authFetch } from "@/lib/api";
import toast from "react-hot-toast";
import {
  UserRound,
  Camera,
  Loader2,
  Save,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export default function CustomerProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    queueMicrotask(() => {
      if (user) {
        setName(user.name || "");
        setImageUrl(user.image || "");
        setImagePreview(user.image || "");
        setPhone(user.phone || "");
        setDeliveryAddress(user.deliveryAddress || "");
      }
    });
  }, [user]);

  const resizeImageToDataUrl = (file, maxDim = 512, quality = 0.82) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Invalid image"));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    setUploading(true);
    try {
      if (IMGBB_API_KEY) {
        const form = new FormData();
        form.append("image", file);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          { method: "POST", body: form }
        );
        const data = await res.json();
        if (data?.data?.url) {
          setImageUrl(data.data.url);
          toast.success("Image uploaded! Save changes to apply.");
        } else {
          throw new Error("ImgBB upload failed");
        }
      } else {
        const dataUrl = await resizeImageToDataUrl(file);
        setImageUrl(dataUrl);
        toast.success("Image ready! Save changes to apply.");
      }
    } catch {
      toast.error("Image upload failed. Please try another photo.");
      setImagePreview(user?.image || "");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      // Auth profile update
      const res = await authFetch(`/user/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl || undefined,
          phone: phone.trim() || undefined,
          deliveryAddress: deliveryAddress.trim() || undefined,
        }),
      }).catch(() => null);

      // Fallback
      const res2 =
        !res?.ok && user?.email
          ? await authFetch(`/users/${user.id || user._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                name: name.trim(),
                image: imageUrl || undefined,
                phone: phone.trim() || undefined,
                deliveryAddress: deliveryAddress.trim() || undefined,
              }),
            }).catch(() => null)
          : null;

      if (res?.ok || res2?.ok) {
        toast.success("Profile updated successfully!");
        // Refresh session
        if (typeof updateSession === "function") {
          await updateSession().catch(() => null);
        }
      } else {
        toast.error("Could not save changes. Please try again.");
      }
    } catch {
      toast.error("Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const displayImage = imagePreview || user?.image;
  const initials = getInitials(user?.name || "U");

  return (
    <div className="min-h-screen bg-surface p-5 text-content md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <p className="mb-2 text-sm font-medium text-orange-400">
            Dashboard / Profile Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="mt-2 text-sm text-muted-content">
            Update your name and profile picture.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-surface bg-card-surface/60 p-6">
            <div className="relative">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-[#FEC447]/30"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/20 text-2xl font-bold text-orange-400 ring-2 ring-[#FEC447]/30">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FEC447] text-black shadow-md transition hover:bg-[#eab536] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center">
              <p className="font-semibold">{user?.name || "Your Name"}</p>
              <p className="text-sm text-muted-content">{user?.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5 rounded-2xl border border-surface bg-card-surface/60 p-6">
            {/* Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-content">
                <UserRound size={15} />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none transition placeholder:text-muted-content focus:border-[#FEC447]/60 focus:ring-1 focus:ring-[#FEC447]/30"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-content">
                <Mail size={15} />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-surface bg-surface/50 px-4 py-3 text-sm text-muted-content outline-none"
              />
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-content">
                <ShieldCheck size={12} className="text-green-400" />
                Email cannot be changed for security reasons.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-content">
                <Phone size={15} />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none transition placeholder:text-muted-content focus:border-[#FEC447]/60 focus:ring-1 focus:ring-[#FEC447]/30"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-content">
                <MapPin size={15} />
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                rows={3}
                className="w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none transition placeholder:text-muted-content focus:border-[#FEC447]/60 focus:ring-1 focus:ring-[#FEC447]/30"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEC447] py-3 text-sm font-bold text-black transition hover:bg-[#eab536] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
