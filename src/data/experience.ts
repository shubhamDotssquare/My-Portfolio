/**
 * PLACEHOLDER CONTENT — never invent real career information.
 * Companies, dates and impact below are illustrative until confirmed by the owner.
 */
export const EXPERIENCE_IS_PLACEHOLDER = true;

export interface Role {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string | "Present";
  location?: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  impact: string[];
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  start: string;
  end: string;
}

export const roles: Role[] = [
  {
    id: "senior-mobile",
    company: "[Placeholder Company A]",
    role: "Senior Mobile Developer",
    start: "2023",
    end: "Present",
    location: "[Remote]",
    summary:
      "[Placeholder] Leading mobile development for consumer products, owning architecture and release quality.",
    responsibilities: [
      "Own app architecture, code review and release process",
      "Mentor developers and set engineering standards",
      "Partner with design on interaction and motion",
    ],
    technologies: ["React Native", "TypeScript", "Firebase", "CI/CD"],
    impact: ["[Placeholder] Cut cold start noticeably", "[Placeholder] Raised crash-free sessions above 99.8%"],
  },
  {
    id: "mobile",
    company: "[Placeholder Company B]",
    role: "Mobile Developer",
    start: "2021",
    end: "2023",
    summary: "[Placeholder] Shipped features across several client apps on iOS and Android.",
    responsibilities: [
      "Build features end-to-end from API to UI",
      "Implement design systems and animations",
      "Write unit and integration tests",
    ],
    technologies: ["React Native", "TypeScript", "REST APIs", "Jest"],
    impact: ["[Placeholder] Delivered multiple store releases on schedule"],
  },
  {
    id: "junior",
    company: "[Placeholder Company C]",
    role: "Junior Developer",
    start: "2019",
    end: "2021",
    summary: "[Placeholder] Started in web, moved into mobile as the team's apps grew.",
    responsibilities: ["Implement UI from designs", "Fix bugs and improve test coverage"],
    technologies: ["React", "JavaScript", "Node.js"],
    impact: ["[Placeholder] Became the go-to developer for the mobile codebase"],
  },
];

export const education: Education[] = [
  {
    id: "degree",
    institution: "[Placeholder University]",
    qualification: "[Placeholder Degree]",
    start: "2015",
    end: "2019",
  },
];
