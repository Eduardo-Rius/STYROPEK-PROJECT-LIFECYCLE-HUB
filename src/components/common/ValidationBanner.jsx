import React from "react";
import { XCircle } from "lucide-react";

export default function ValidationBanner({ messages }) {
  if (!messages || messages.length === 0) return null;
  return (
    <div className="border border-red-200 bg-red-50 text-red-800 rounded-md p-4 flex items-start space-x-3">
      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex flex-col space-y-1">
        {messages.map((msg, idx) => (
          <p key={idx} className="text-sm font-medium">{msg}</p>
        ))}
      </div>
    </div>
  );
}
