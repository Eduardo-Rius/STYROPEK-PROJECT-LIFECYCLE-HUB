import React from 'react';

/**
 * Avatar component that shows initials derived from a string (e.g., user ID or name).
 * @param {Object} props
 * @param {string} props.text - The source text to derive initials from.
 * @param {string} [props.size] - Tailwind size class (e.g., '8' for w-8 h-8).
 * @param {string} [props.bgColor] - Tailwind background color name (e.g., 'brand').
 */
export function Avatar({ text, size = '8', bgColor = 'brand' }) {
  const initials = text
    .replace(/^usr-/, '') // remove prefix if present
    .split(/\s+/)
    .map((s) => s.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  const bgClass = `bg-${bgColor}-500`;
  const textClass = `text-white`;
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className={`rounded-full flex items-center justify-center ${bgClass} ${textClass} ${sizeClass}`}>
      {initials}
    </div>
  );
}

export default Avatar;
