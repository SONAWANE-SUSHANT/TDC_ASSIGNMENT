export const formatCurrency = (value) => {
  if (!value && value !== 0) return "Not provided";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};

export const formatDate = (date) => {
  if (!date) return "Not provided";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
};

export const formatHeight = (height) => {
  if (!height) return "Not provided";
  const feet = Math.floor(height / 30.48);
  const inches = Math.round(height / 2.54 - feet * 12);
  return `${height} cm (${feet}'${inches}")`;
};

export const fullName = (customer) => `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim();
