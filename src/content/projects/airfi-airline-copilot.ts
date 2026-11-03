import { type Project } from "@/types/content";

/** Source: both resumes (AirFi, May 2024 – Jan 2026). */
export const airfiAirlineCopilot: Project = {
  slug: "airfi-airline-copilot",
  status: "published",
  title: "Airline Copilot",
  summary:
    "A GPT-powered conversational interface that gives passengers insights about their itinerary.",
  category: "AI interface",
  role: "Senior Frontend Engineer",
  company: "AirFi.aero",
  timeline: "2024–2026",
  stack: ["LLM / GPT integration", "Conversational UI", "React"],
  related: ["airfi-realtime-platform", "airfi-offline-sync"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "I delivered and launched the Airline Copilot at AirFi: a GPT-integrated conversational interface that gives passengers itinerary insights.",
      },
    ],
  },
};
