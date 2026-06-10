import React from "react";

export default function SectionCard({ title, description, children }) {
  return (
    <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
      <h3 className="text-base font-bold text-industrial-950 font-heading">{title}</h3>
      {description && <p className="text-xs text-industrial-500 mb-2">{description}</p>}
      {children}
    </div>
  );
}
