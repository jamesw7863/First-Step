"use client";

import { FormEvent, useState } from "react";

type SubmissionState = "idle" | "loading" | "success" | "error";

export function PreferenceForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [interests, setInterests] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const parsedInterests = interests
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const payload = {
      email,
      school: "UCF",
      major,
      graduationYear: new Date().getFullYear() + 1,
      internshipTypes: parsedInterests.length > 0 ? parsedInterests : ["general internship"],
      keywords: parsedInterests.length > 0 ? parsedInterests : ["internship"],
      locations: ["Orlando", "Remote"],
      workStyle: "any"
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
    setMessage("You are in. FirstStep will email your daily internship matches.");
  }

  return (
    <form className="hero-form" onSubmit={onSubmit}>
      <div className="hero-form-row two-col">
        <label>
          <span>YOUR EMAIL</span>
          <input
            type="email"
            required
            value={email}
            placeholder="alex@university.edu"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          <span>YOUR MAJOR</span>
          <input
            required
            value={major}
            placeholder="e.g. Computer Science, Marketing"
            onChange={(event) => setMajor(event.target.value)}
          />
        </label>
      </div>

      <div className="hero-form-row">
        <label>
          <span>SPECIFIC INTERESTS</span>
          <input
            value={interests}
            placeholder="e.g. Fintech, Sustainable Energy, UX Design, Non-profits..."
            onChange={(event) => setInterests(event.target.value)}
          />
        </label>
      </div>

      <button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Starting..." : "Start Daily Alerts ->"}
      </button>

      {message ? <p className={`form-status ${state}`}>{message}</p> : null}
    </form>
  );
}
