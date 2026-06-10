/**
 * Formats a number to USD currency string.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency.
 */
export function formatUSD(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "$0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Formats a date or Firestore timestamp to a readable local date string (DD/MM/YYYY).
 * @param {any} date - Date object, ISO string, or Firestore Timestamp.
 * @returns {string} Formatted date string.
 */
export function formatDate(date) {
  if (!date) return "-";
  
  let d = date;
  
  // Handle Firestore Timestamps
  if (date && typeof date.toDate === "function") {
    d = date.toDate();
  } else if (date && date.seconds !== undefined) {
    d = new Date(date.seconds * 1000);
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) return "-";
  
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(d);
}

/**
 * Formats a date or Firestore timestamp to standard datetime string (DD/MM/YYYY HH:mm).
 * @param {any} date - Date object, ISO string, or Firestore Timestamp.
 * @returns {string} Formatted date and time string.
 */
export function formatDateTime(date) {
  if (!date) return "-";
  
  let d = date;
  
  // Handle Firestore Timestamps
  if (date && typeof date.toDate === "function") {
    d = date.toDate();
  } else if (date && date.seconds !== undefined) {
    d = new Date(date.seconds * 1000);
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  }
  
  if (isNaN(d.getTime())) return "-";
  
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);
}

/**
 * Formats file size in bytes to readable string (e.g. KB, MB).
 * @param {number} bytes - File size in bytes.
 * @returns {string} Formatted file size.
 */
export function formatFileSize(bytes) {
  if (bytes === 0 || !bytes) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
