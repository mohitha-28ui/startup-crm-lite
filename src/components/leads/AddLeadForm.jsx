import { useContext, useState } from "react";
import { LeadContext } from "../../context/LeadContext";

function AddLeadForm() {
  const { addLead } = useContext(LeadContext);

  const [form, setForm] = useState({
    name: "",
    company: "",
    value: "",
    status: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addLead(form);

    setForm({
      name: "",
      company: "",
      value: "",
      status: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-2xl font-bold mb-4">
        Add New Lead
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Lead Name"
          className="border p-3 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Company"
          className="border p-3 rounded"
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Value"
          className="border p-3 rounded"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Status"
          className="border p-3 rounded"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-5 py-3 rounded"
      >
        Add Lead
      </button>
    </form>
  );
}

export default AddLeadForm;