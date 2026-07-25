import { useState } from "react";
import { STATUS_OPTIONS, SOURCE_OPTIONS } from "../../constants";

/**
 * LeadForm component renders a form to create or edit lead information.
 * Refined with focus glow borders, text input shadows, and gradient save buttons.
 */
function LeadForm({ initialData = null, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    company: initialData?.company || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || "New",
    source: initialData?.source || "Website",
    value: initialData?.value || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    
    if (!form.name.trim()) {
      nextErrors.name = "Contact name is required";
    }
    
    if (!form.company.trim()) {
      nextErrors.company = "Company name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      let finalValue = form.value.trim();
      if (finalValue && !finalValue.startsWith("$")) {
        const numeric = parseFloat(finalValue.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(numeric)) {
          finalValue = `$${numeric.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
        }
      }
      
      onSubmit({
        ...form,
        value: finalValue || "$0",
      });
    }
  };

  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3 tracking-tight">
        {initialData ? "Edit Lead Details" : "Register New Lead"}
      </h2>

      {/* Name Input */}
      <div>
        <label htmlFor="lead-name" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-name"
          type="text"
          className={`w-full p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-semibold ${
            errors.name ? "border-red-300 focus:ring-red-200/50" : "border-slate-200 dark:border-slate-800 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500"
          }`}
          placeholder="E.g., John Doe"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.name}</p>}
      </div>

      {/* Company Input */}
      <div>
        <label htmlFor="lead-company" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-company"
          type="text"
          className={`w-full p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-semibold ${
            errors.company ? "border-red-300 focus:ring-red-200/50" : "border-slate-200 dark:border-slate-800 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500"
          }`}
          placeholder="E.g., Acme Corporation"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          aria-invalid={!!errors.company}
        />
        {errors.company && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.company}</p>}
      </div>

      {/* Grid for Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Input */}
        <div>
          <label htmlFor="lead-email" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-email"
            type="text"
            className={`w-full p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-semibold ${
              errors.email ? "border-red-300 focus:ring-red-200/50" : "border-slate-200 dark:border-slate-800 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500"
            }`}
            placeholder="johndoe@company.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1.5 font-semibold">{errors.email}</p>}
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="lead-phone" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="tel"
            className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-semibold"
            placeholder="+1 (555) 123-4567"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Grid for Status, Source, and Valuation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Select */}
        <div>
          <label htmlFor="lead-status" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Pipeline Status
          </label>
          <select
            id="lead-status"
            className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-905 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-semibold"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div>
          <label htmlFor="lead-source" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Lead Source
          </label>
          <select
            id="lead-source"
            className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-905 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-semibold"
            value={form.source}
            onChange={(e) => handleChange("source", e.target.value)}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Deal Value Input */}
        <div>
          <label htmlFor="lead-value" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Deal Value ($)
          </label>
          <input
            id="lead-value"
            type="text"
            className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-semibold"
            placeholder="E.g., 5000"
            value={form.value}
            onChange={(e) => handleChange("value", e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-transparent border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all duration-200 cursor-pointer text-xs"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200 cursor-pointer text-xs"
        >
          {initialData ? "Save Changes" : "Create Lead"}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
