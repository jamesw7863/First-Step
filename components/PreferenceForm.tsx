"use client";

import { FormEvent, useState } from "react";

type SubmissionState = "idle" | "loading" | "success" | "error";

const ucfMajors = [
  "Accounting",
  "Aerospace Engineering",
  "Anthropology",
  "Architecture",
  "Art",
  "Biology",
  "Biomedical Sciences",
  "Business Administration",
  "Chemistry",
  "Civil Engineering",
  "Communication Sciences and Disorders",
  "Computer Engineering",
  "Computer Science",
  "Construction Management",
  "Criminal Justice",
  "Data Science",
  "Digital Media",
  "Early Childhood Development and Education",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Elementary Education",
  "Engineering Management",
  "English",
  "Entertainment Management",
  "Environmental Engineering",
  "Film",
  "Finance",
  "Health Informatics and Information Management",
  "Health Sciences",
  "History",
  "Hospitality Management",
  "Human Communication",
  "Industrial Engineering",
  "Information Technology",
  "Integrated Business",
  "Interdisciplinary Studies",
  "Journalism",
  "Kinesiology",
  "Legal Studies",
  "Management",
  "Marketing",
  "Mathematics",
  "Mechanical Engineering",
  "Nursing",
  "Philosophy",
  "Physics",
  "Political Science",
  "Psychology",
  "Public Administration",
  "Public Relations",
  "Real Estate",
  "Sociology",
  "Social Work",
  "Sport and Exercise Science",
  "Statistics",
  "Theatre",
  "Web Design"
];

export function PreferenceForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [internshipTime, setInternshipTime] = useState("Summer 2026");
  const [academicLevel, setAcademicLevel] = useState("Undergrad");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    if (!selectedMajor) {
      setState("error");
      setMessage("Select a major or minor.");
      return;
    }

    const payload = {
      email,
      school: "UCF",
      major: selectedMajor,
      graduationYear: new Date().getFullYear() + 1,
      internshipTypes: [internshipTime],
      keywords: [academicLevel, selectedMajor, name].filter(Boolean),
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
    setMessage("You are in. FirstStep will send daily matches to your email.");
  }

  return (
    <form className="hero-form" onSubmit={onSubmit}>
      <div className="hero-form-row two-col">
        <label>
          <span>NAME</span>
          <input required value={name} placeholder="Your full name" onChange={(event) => setName(event.target.value)} />
        </label>

        <label>
          <span>EMAIL</span>
          <input
            type="email"
            required
            value={email}
            placeholder="knight@ucf.edu"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
      </div>

      <div className="hero-form-row two-col">
        <label>
          <span>MAJOR / MINOR</span>
          <select value={selectedMajor} onChange={(event) => setSelectedMajor(event.target.value)}>
            <option value="" disabled>
              Select major/minor
            </option>
            {ucfMajors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>TIME OF INTERNSHIP</span>
          <select value={internshipTime} onChange={(event) => setInternshipTime(event.target.value)}>
            <option>Spring 2026</option>
            <option>Summer 2026</option>
            <option>Fall 2026</option>
            <option>Spring 2027</option>
            <option>Summer 2027</option>
          </select>
        </label>
      </div>

      <div className="hero-form-row">
        <label>
          <span>UNDERGRAD / POSTGRAD</span>
          <select value={academicLevel} onChange={(event) => setAcademicLevel(event.target.value)}>
            <option>Undergrad</option>
            <option>Postgrad</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Starting..." : "Start Daily Alerts ->"}
      </button>

      {message ? <p className={`form-status ${state}`}>{message}</p> : null}
    </form>
  );
}
