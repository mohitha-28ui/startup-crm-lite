import React, { useState, useEffect } from "react";

/**
 * LeadForm component renders a form to create or edit lead information,
 * with validation warnings for mandatory inputs.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} [props.initialData] - The initial lead object if pre-populating for Edit mode.
 * @param {function} props.onSubmit - Callback function triggered upon successful form submission.
 * @param {function} props.onCancel - Callback function triggered when form editing is cancelled.
 * @returns {React.JSX.Element} The rendered LeadForm component.
 */
function LeadForm({ initialData = null, onSubmit, onCancel }) {
  // Status and Source options requested by requirements
  const STATUS_OPTIONS = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
  const SOURCE_OPTIONS = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"];

  // Local state for the lead object
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "New",
    source: "Website",
    value: "",
  });

  // Local state for validation errors
  const [errors, setErrors] = useState({});

  // Sync state if initialData changes (e.g. switching between different leads for editing)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        company: initialData.company || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        status: initialData.status || "New",
        source: initialData.source || "Website",
        value: initialData.value || "",
      });
    } else {
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "New",
        source: "Website",
        value: "",
      });
    }
    setErrors({});
  }, [initialData]);

  /**
   * Validates form inputs and updates inline error states.
   * @returns {boolean} True if form inputs are valid.
   */
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

  /**
   * Form submission handler.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Clean up lead value representation (e.g., prefixing $ if a bare number was entered)
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

  /**
   * Helper to update form fields by key.
   */
  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null }); // Clear error as user types
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
        {initialData ? "Edit Lead Details" : "Register New Lead"}
      </h2>

      {/* Name Input */}
      <div>
        <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Contact Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-name"
          type="text"
          className={`w-full p-3 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.name ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
          }`}
          placeholder="E.g., John Doe"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
      </div>

      {/* Company Input */}
      <div>
        <label htmlFor="lead-company" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-company"
          type="text"
          className={`w-full p-3 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
            errors.company ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
          }`}
          placeholder="E.g., Acme Corporation"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          aria-invalid={!!errors.company}
        />
        {errors.company && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.company}</p>}
      </div>

      {/* Grid for Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Input */}
        <div>
          <label htmlFor="lead-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-email"
            type="text"
            className={`w-full p-3 border rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.email ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
            }`}
            placeholder="johndoe@company.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email}</p>}
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="lead-phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="tel"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
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
          <label htmlFor="lead-status" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Pipeline Status
          </label>
          <select
            id="lead-status"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Source Select */}
        <div>
          <label htmlFor="lead-source" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Lead Source
          </label>
          <select
            id="lead-source"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
            value={form.source}
            onChange={(e) => handleChange("source", e.target.value)}
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Deal Value Input */}
        <div>
          <label htmlFor="lead-value" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Deal Value ($)
          </label>
          <input
            id="lead-value"
            type="text"
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
            placeholder="E.g., 5000"
            value={form.value}
            onChange={(e) => handleChange("value", e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
        >
          {initialData ? "Save Changes" : "Create Lead"}
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
