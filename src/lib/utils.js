export { cn } from "cn";

export const getInitials = (name) => {
  if (!name?.trim()) return "GU";

  const words = name.trim().split(/\s+/);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
};

export const getProfileHref = (user) => {
  if (user?.role === "admin") return "/dashboard/admin";
  if (user?.role === "vendor") return "/dashboard/vendor/profile";

  return "/customer";
};
