import React from "react";
import { FormData } from "../utils/validation";

interface SuccessScreenProps {
  formData: FormData;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData, onReset }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-400/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
            <svg
              className="w-10 h-10 text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            Formulier verzonden!
          </h2>
          <p className="text-white/80 mt-2 drop-shadow">
            Bedankt voor je inzending.
          </p>
        </div>
        <div className="space-y-3 text-sm bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/90">
            <strong className="text-white">Naam:</strong> {formData.name}
          </p>
          <p className="text-white/90">
            <strong className="text-white">Email:</strong> {formData.email}
          </p>
          <p className="text-white/90">
            <strong className="text-white">Leeftijd:</strong> {formData.age}
          </p>
          <p className="text-white/90">
            <strong className="text-white">Bericht:</strong>{" "}
            {formData.message || "Geen bericht"}
          </p>
        </div>
        <button
          onClick={onReset}
          className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl"
        >
          Nieuw formulier
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
