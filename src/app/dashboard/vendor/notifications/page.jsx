
"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Pizza,
  ShoppingBag,
  ShieldCheck,
  Info,
  Clock,
  CheckCircle2,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "Pizza Approved!",
    description:
      "Your Margherita Pizza has been approved by the admin and is now live on Pizzora.",
    type: "approval",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "New Order Received",
    description:
      "You received a new order for 2 Pepperoni Pizzas. Order #PZ-1001.",
    type: "order",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Pizza Under Review",
    description:
      "Your BBQ Chicken Pizza has been submitted and is waiting for admin approval.",
    type: "pending",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    title: "Profile Updated",
    description:
      "Your business profile information has been successfully updated.",
    type: "system",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    title: "Pizza Rejected",
    description:
      "Your Special Pizza submission was rejected. Please review the admin feedback.",
    type: "rejected",
    time: "3 days ago",
    read: false,
  },
];

const notificationIcons = {
  approval: CheckCircle2,
  order: ShoppingBag,
  pending: Clock,
  system: Info,
  rejected: ShieldCheck,
};

const iconStyles = {
  approval: "bg-green-500/10 text-green-400",
  order: "bg-blue-500/10 text-blue-400",
  pending: "bg-yellow-500/10 text-yellow-400",
  system: "bg-purple-500/10 text-purple-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-2 text-sm text-muted-content">
            Stay updated with your business activities.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 rounded-xl border border-surface px-4 py-3 text-sm font-semibold text-[#FEC447] transition hover:bg-card-surface disabled:opacity-40"
        >
          <CheckCheck size={18} />
          Mark All as Read
        </button>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-surface bg-card-surface/60 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FEC447]/10 p-3 text-[#FEC447]">
              <Bell size={22} />
            </div>
            <div>
              <p className="text-sm text-muted-content">Total Notifications</p>
              <h2 className="mt-1 text-2xl font-bold">
                {notifications.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface bg-card-surface/60 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-500/10 p-3 text-yellow-400">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm text-muted-content">Unread Notifications</p>
              <h2 className="mt-1 text-2xl font-bold">
                {unreadCount}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-surface bg-card-surface/60">
        <div className="flex items-center justify-between border-b border-surface px-6 py-5">
          <h2 className="font-bold">Recent Notifications</h2>
          <span className="text-xs text-muted-content">
            {unreadCount} unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Bell size={45} className="text-muted-content" />
            <h3 className="mt-4 font-semibold">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-content">
              You don't have any notifications right now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-4 p-5 transition hover:bg-card-surface/30 sm:flex-row sm:items-start ${
                    !notification.read ? "bg-[#FEC447]/[0.03]" : ""
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyles[notification.type]}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-[#FEC447]" />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-content">
                      {notification.description}
                    </p>

                    <p className="mt-3 text-xs text-muted-content">
                      {notification.time}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!notification.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() => markRead(notification.id)}
                        className="rounded-lg border border-surface p-2 text-muted-content hover:border-[#FEC447] hover:text-[#FEC447]"
                      >
                        <CheckCheck size={17} />
                      </button>
                    )}

                    <button
                      type="button"
                      title="Delete notification"
                      onClick={() =>
                        deleteNotification(notification.id)
                      }
                      className="rounded-lg border border-surface p-2 text-muted-content hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
