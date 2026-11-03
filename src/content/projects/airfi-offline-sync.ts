import { type Project } from "@/types/content";

/** Source: both resumes (AirFi, May 2024 – Jan 2026). Add detail, screenshots and lessons when available. */
export const airfiOfflineSync: Project = {
  slug: "airfi-offline-sync",
  status: "published",
  title: "Offline-first sync engine",
  summary:
    "A PWA sync engine that lets operations teams capture data reliably without connectivity, using background sync, request queuing and conflict resolution.",
  category: "Offline-first architecture",
  role: "Senior Frontend Engineer, frontend architecture owner",
  company: "AirFi.aero",
  timeline: "2024–2026",
  stack: ["PWA", "Background sync", "Request queuing", "Conflict resolution"],
  featured: false,
  related: ["airfi-realtime-platform", "airfi-airline-copilot"],
  caseStudy: {
    overview: [
      {
        type: "paragraph",
        text: "At AirFi I owned frontend architecture for global airline platforms. One of those platforms served operations teams who often work without a reliable connection, so I architected an offline-first PWA sync engine for them.",
      },
    ],
    problem: [
      {
        type: "callout",
        title: "Problem statement",
        text: "Operations teams needed to capture data reliably in low-connectivity environments without losing their work.",
      },
    ],
    role: [
      {
        type: "list",
        items: [
          "Architected the offline-first sync engine as part of owning frontend architecture for the platform.",
          "Set the code-quality, review and delivery standards the frontend team adopted.",
        ],
      },
    ],
    architecture: [
      {
        type: "paragraph",
        text: "The engine combines three mechanisms: requests are queued locally while offline, background sync sends them when a connection returns, and conflict resolution reconciles changes made on both sides.",
      },
      {
        type: "flow-diagram",
        title: "Offline capture, simplified",
        steps: [
          { label: "Capture data", note: "Works without connectivity" },
          { label: "Queue request", note: "Stored on the device" },
          { label: "Background sync", note: "Sent when back online", highlight: true },
          { label: "Resolve conflicts" },
        ],
        caption: "The path a change takes from an offline device to the server.",
      },
    ],
    technology: [
      {
        type: "definitions",
        items: [
          { term: "PWA", description: "Installable web app that keeps working offline." },
          {
            term: "Background sync",
            description: "Sends queued requests once connectivity returns.",
          },
          {
            term: "Request queuing",
            description: "Keeps every change made offline until it can be sent.",
          },
          {
            term: "Conflict resolution",
            description: "Reconciles changes made on the device and on the server.",
          },
        ],
      },
    ],
  },
};
