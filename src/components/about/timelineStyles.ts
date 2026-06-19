import type { ResumeExperience } from "@/data/resume";

export function getTagLabel(tag: string) {
  const labels: Record<string, string> = {
    general: "General",
    "it-technician": "IT Technician",
    developer: "Developer",
    supervisor: "Supervisor",
    operations: "Operations",
    "customer-support": "Customer Support",
    "field-operations": "Field Operations",
    repair: "Repair",
    networking: "Networking",
    leadership: "Leadership",
  };

  return labels[tag] ?? tag;
}

export function getCategoryStyle(category: ResumeExperience["category"]) {
  switch (category) {
    case "Education":
      return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
    case "Internship":
      return "border-purple-300/30 bg-purple-300/10 text-purple-200";
    case "Business":
      return "border-blue-300/30 bg-blue-300/10 text-blue-200";
    case "Work":
    default:
      return "border-white/15 bg-white/10 text-white/80";
  }
}