"use client";

import { FormEvent, useMemo, useState } from "react";

type SubmissionState = "idle" | "loading" | "success" | "error";

const defaultMajorMap: Record<string, string[]> = {
  "Computer Science": ["software engineering", "data", "cybersecurity"],
  Nursing: ["clinical", "public health", "hospital"],
  Finance: ["investment", "operations", "accounting"],
  Marketing: ["digital marketing", "brand", "analytics"]
};

export function PreferenceForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string>("");
  const [major, setMajor] = useState("Computer Science");
  const [email, setEmail] = useState("");
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() + 1);
  const [types, setTypes] = useState("software engineering, data science");
  const [keywords, setKeywords] = useState("intern, entry level");
  const [locations, setLocations] = useState("Orlando, Remote");
  const [workStyle, setWorkStyle] = useState("any");

  const starterKeywords = useMemo(() => {
    return defaultMajorMap[major]?.join(", ") ?? "";
  }, [major]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const payload = {
      email,
      school: "UCF",
      major,
      graduationYear,
      internshipTypes: types.split(",").map((value) => value.trim()).filter(Boolean),
      keywords: keywords.split(",").map((value) => value.trim()).filter(Boolean),
      locations: locations.split(",").map((value) => value.trim()).filter(Boolean),
      workStyle
    };

    const response = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({ error: "Unknown failure" }));
      setState("error");
      setMessage(errorPayload.error ?? "Unable to save preferences.");
      return;
    }

    setState("success");
    setMessage("Preferences saved. Check your email for daily internship digests.");
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Set your internship preferences</h2>
      <p>
        <small>Get one daily email with new internships discovered in the last 24 hours.</small>
      </p>
      <div className="grid">
        <label>
          Email
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Major
          <select value={major} onChange={(event) => setMajor(event.target.value)}>
            <option>Computer Science</option>
            <option>Nursing</option>
            <option>Finance</option>
            <option>Marketing</option>
            <option>Mechanical Engineering</option>
            <option>Biology</option>
          </select>
        </label>
        <label>
          Graduation Year
          <input
            type="number"
            min={new Date().getFullYear()}
            max={new Date().getFullYear() + 8}
            value={graduationYear}
            onChange={(event) => setGraduationYear(Number(event.target.value))}
          />
        </label>
        <label>
          Internship Types (comma-separated)
          <input value={types} onChange={(event) => setTypes(event.target.value)} />
        </label>
        <label>
          Keywords (comma-separated)
          <input
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder={starterKeywords}
          />
        </label>
        <label>
          Preferred Locations (comma-separated)
          <input value={locations} onChange={(event) => setLocations(event.target.value)} />
        </label>
        <label>
          Work Style
          <select value={workStyle} onChange={(event) => setWorkStyle(event.target.value)}>
            <option value="any">Any</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </label>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Saving..." : "Save Preferences"}
        </button>
      </div>
      {message ? (
        <p>
          <small>{message}</small>
        </p>
      ) : null}
    </form>
  );
}
