import React from "react";

export default function FormStepper({ steps, currentStep }) {
  return (
    <div className="flex space-x-4 mb-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex-1 text-center py-2 border-b-2 ${index === currentStep ? "border-brand-600 text-brand-700 font-bold" : "border-transparent text-industrial-500"}`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
