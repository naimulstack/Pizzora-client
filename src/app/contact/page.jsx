"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CONTACT_INFO = [
  {
    title: "Email Support",
    value: "support@pizzora.com",
    description: "We reply within 24 hours on business days.",
    icon: Mail,
  },
  {
    title: "Phone Hotline",
    value: "+880 1700-000000",
    description: "Available for order and vendor assistance.",
    icon: Phone,
  },
  {
    title: "Location",
    value: "Chattogram & Dhaka, Bangladesh",
    description: "Serving local partner kitchens and customers.",
    icon: MapPin,
  },
  {
    title: "Operating Hours",
    value: "Daily • 10:00 AM – 11:00 PM",
    description: "Kitchen hours may vary by vendor.",
    icon: Clock,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Order Support",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Your message has been sent!");
      setFormData({
        name: "",
        email: "",
        topic: "Order Support",
        message: "",
      });
    }, 400);
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-10 text-content sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <Badge
            variant="outline"
            className="border-orange-500/30 bg-orange-500/10 text-orange-400"
          >
            Pizzora / Contact Us
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
            Get in Touch With Us
          </h1>
          <p className="text-sm text-muted-content sm:text-base">
            Have a question about an order, partnering as a vendor, or feedback
            on our pizzas? Send us a message below.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Form Card */}
          <Card className="rounded-2xl border-surface bg-card-surface/50 text-content lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-content">
                Send a Message
              </CardTitle>
              <CardDescription className="text-muted-content">
                Fill out the form and our team will get back to you shortly.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {submitted && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span>
                    Thanks for reaching out! We have received your message.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-content"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="h-11 rounded-xl border-surface bg-surface text-content placeholder:text-muted-content focus-visible:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-content"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-11 rounded-xl border-surface bg-surface text-content placeholder:text-muted-content focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="topic"
                    className="text-sm font-medium text-content"
                  >
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-surface bg-surface px-3.5 text-sm text-content outline-none transition focus:border-orange-500"
                  >
                    <option value="Order Support">Order Support</option>
                    <option value="Vendor Partnership">Vendor Partnership</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-content"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="rounded-xl border-surface bg-surface text-content placeholder:text-muted-content focus-visible:ring-orange-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full gap-2 rounded-xl bg-orange-500 font-semibold text-black transition hover:bg-orange-400 sm:w-auto sm:px-6"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="rounded-2xl border-surface bg-card-surface/50 text-content transition hover:border-surface"
                >
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-content">
                        {item.title}
                      </p>
                      <p className="text-sm font-semibold text-content">
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-content">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}