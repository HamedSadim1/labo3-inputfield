import React, { useState } from "react";
import InputField from "./InputField";
import SuccessScreen from "./SuccessScreen";
import { FormData, ValidationErrors, validateForm } from "../utils/validation";

const InputFields: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    message: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      // In a real app, you might send this to a server
      console.log("Form submitted:", formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return <SuccessScreen formData={formData} onReset={resetForm} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Contact Formulier
          </h1>
          <p className="text-white/80 mt-2 drop-shadow">Vul je gegevens in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Naam"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Je naam"
            required
          />

          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="je@email.com"
            required
          />

          <InputField
            label="Leeftijd"
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
            placeholder="18"
            min="0"
            required
          />

          <InputField
            label="Wachtwoord"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Minstens 6 karakters"
            required
          />

          <InputField
            label="Bevestig wachtwoord"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Herhaal wachtwoord"
            required
          />

          <InputField
            label="Bericht"
            type="textarea"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Optioneel bericht..."
            rows={4}
          />

          <button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl"
          >
            Verzenden
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputFields;
