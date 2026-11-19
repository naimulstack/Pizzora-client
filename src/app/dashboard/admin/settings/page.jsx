
"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Store,
  Bell,
  ShoppingBag,
  Save,
} from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    pizzaRequests: true,
    vendorMessages: true,
    emailAlerts: false,
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [marketplace, setMarketplace] = useState({
    name: "Pizzora",
    email: "",
    currency: "USD",
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings UI is ready. Backend integration is coming next.");
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-zinc-800 bg-[#09090b] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500";

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-orange-400">
          Pizzora / Configuration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage your administrator profile and marketplace preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <User size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Admin Profile</h2>
              <p className="text-sm text-zinc-500">
                Your administrator information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-400">Full Name</label>
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
              <label className="text-sm text-zinc-400">Email Address</label>
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
              <label className="text-sm text-zinc-400">Phone Number</label>
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

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <Store size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                Marketplace Settings
              </h2>
              <p className="text-sm text-zinc-500">
                General marketplace information.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-400">
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
              <label className="text-sm text-zinc-400">
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
              <label className="text-sm text-zinc-400">Currency</label>
              <select
                value={marketplace.currency}
                onChange={(e) =>
                  setMarketplace({ ...marketplace, currency: e.target.value })
                }
                className={inputClass}
              >
                <option value="USD">USD ($)</option>
                <option value="BDT">BDT (৳)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <Bell size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">
                Notification Preferences
              </h2>
              <p className="text-sm text-zinc-500">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { key: "newOrders", title: "New Orders", description: "When a customer places a new order." },
              { key: "pizzaRequests", title: "Pizza Requests", description: "When a vendor submits a new pizza." },
              { key: "vendorMessages", title: "Vendor Messages", description: "When a vendor sends a message." },
              { key: "emailAlerts", title: "Email Notifications", description: "Receive marketplace alerts through email." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.description}</p>
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

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 md:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <ShoppingBag size={21} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Order Preferences</h2>
              <p className="text-sm text-zinc-500">
                Order processing will be managed through the order management system.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
