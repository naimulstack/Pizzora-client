const STORAGE_KEY = "pizzora_vendor_profile";

export const EMPTY_VENDOR_PROFILE = {
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  logo: "",
  coverImage: "",
  location: "",
  address: "",
  description: "",
  facebook: "",
  instagram: "",
  website: "",
};

export function getVendorProfile() {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load vendor profile", error);
    return null;
  }
}

export function saveVendorProfile(profile) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save vendor profile", error);
  }
}
