import { useState } from "react";
import { submitFeedback } from "../api/feedbackService";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function Feedback() {
  const [feedback, setFeedback] = useState({
    name: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(feedback).then(() => {
      setSubmitted(true);
      setFeedback({ name: "", message: "" });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
      <div className="rounded-2xl border p-8 w-full max-w-lg" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
        <h2 className="text-2xl font-black mb-6">Feedback</h2>

        {submitted && (
          <div className="border rounded-lg p-3 mb-4 text-sm" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
            Feedback submitted.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1 block">Your Name</label>
            <input
              name="name"
              placeholder="Your Name"
              value={feedback.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none"
              style={{ borderColor: ACCENT, backgroundColor: "rgba(11,19,43,0.35)", color: ACCENT }}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">Your Feedback</label>
            <textarea
              name="message"
              placeholder="Your Feedback"
              value={feedback.message}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none min-h-[120px]"
              style={{ borderColor: ACCENT, backgroundColor: "rgba(11,19,43,0.35)", color: ACCENT }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold hover:opacity-90"
            style={{ backgroundColor: ACCENT, color: PRIMARY }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
