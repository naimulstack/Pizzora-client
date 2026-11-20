"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Store,
  Bell,
  Save,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const STORAGE_KEY = "pizzora_admin_settings";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [marketplace, setMarketplace] = useState({
    name: "Pizzora",
    email: "",
    currency: "BDT",
    deliveryFee: 60,
    acceptingOrders: true,
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    pizzaRequests: true,
    vendorMessages: true,
    emailAlerts: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.marketplace) setMarketplace((prev) => ({ ...prev, ...parsed.marketplace }));
        if (parsed.notifications) setNotifications(parsed.notifications);
      } catch {
        // ignore invalid local data
      }
    }

    fetch(`${API_URL}/admin/settings`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.profile) setProfile((prev) => ({ ...prev, ...data.profile }));
        if (data.marketplace) {
          setMarketplace((prev) => ({ ...prev, ...data.marketplace }));
        }
        if (data.notifications) {
          setNotifications((prev) => ({ ...prev, ...data.notifications }));
        }
      })
      .catch(() => {});
  }, []);

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = { profile, marketplace, notifications };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    try {
      const res = await fetch(`${API_URL}/admin/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Settings saved to database.");
      } else {
        toast.success("Settings saved locally.");
      }
    } catch {
      toast.success("Settings saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-surface bg-surface px-4 py-3 text-sm text-content outline-none transition focus:border-orange-500";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Configuration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-content">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-content">
          Manage your administrator profile and marketplace preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-surface bg-card-surface/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <User size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-content">Admin Profile</h2>
              <p className="text-sm text-muted-content">
                Your administrator information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-content">Full Name</label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Enter admin name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-muted-content">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter admin email"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-muted-content">Phone Number</label>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-surface bg-card-surface/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <Store size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-content">
                Marketplace Settings
              </h2>
              <p className="text-sm text-muted-content">
                General marketplace information and order defaults.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted-content">
                Marketplace Name
              </label>
              <input
                value={marketplace.name}
                onChange={(e) =>
                  setMarketplace({ ...marketplace, name: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-muted-content">
                Support Email
              </label>
              <input
                type="email"
                value={marketplace.email}
                onChange={(e) =>
                  setMarketplace({ ...marketplace, email: e.target.value })
                }
                placeholder="Support email"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-muted-content">Currency</label>
              <select
                value={marketplace.currency}
                onChange={(e) =>
                  setMarketplace({ ...marketplace, currency: e.target.value })
                }
                className={inputClass}
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-content">
                Standard Delivery Fee (৳)
              </label>
              <input
                type="number"
                min="0"
                value={marketplace.deliveryFee}
                onChange={(e) =>
                  setMarketplace({
                    ...marketplace,
                    deliveryFee: Number(e.target.value),
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-surface/80 pt-5">
            <div>
              <p className="text-sm font-medium text-content">
                Accepting New Orders
              </p>
              <p className="mt-1 text-xs text-muted-content">
                Temporarily pause incoming orders across the store if needed.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMarketplace((prev) => ({
                  ...prev,
                  acceptingOrders: !prev.acceptingOrders,
                }))
              }
              aria-pressed={marketplace.acceptingOrders}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                marketplace.acceptingOrders ? "bg-orange-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  marketplace.acceptingOrders ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-surface bg-card-surface/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <Bell size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-content">
                Notification Preferences
              </h2>
              <p className="text-sm text-muted-content">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                key: "newOrders",
                title: "New Orders",
                description: "When a customer places a new order.",
              },
              {
                key: "pizzaRequests",
                title: "Pizza Requests",
                description: "When a vendor submits a new pizza.",
              },
              {
                key: "vendorMessages",
                title: "Vendor Messages",
                description: "When a vendor sends a message.",
              },
              {
                key: "emailAlerts",
                title: "Email Notifications",
                description: "Receive marketplace alerts through email.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-content">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-content">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  aria-pressed={notifications[item.key]}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    notifications[item.key] ? "bg-orange-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      notifications[item.key] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;