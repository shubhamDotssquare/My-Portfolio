/** Technology stack, grouped — no fake percentages (spec §25). */
export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  { id: "core", title: "Core", skills: ["React Native", "TypeScript"] },
  { id: "web", title: "Web", skills: ["Next.js", "React"] },
  { id: "backend", title: "Backend", skills: ["Node.js", "REST APIs"] },
  { id: "services", title: "Services", skills: ["Firebase", "Stripe"] },
  { id: "quality", title: "Quality", skills: ["Jest", "CI/CD"] },
];
