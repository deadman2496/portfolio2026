export type ResumeFocus =
  | "general"
  | "it-technician"
  | "developer"
  | "supervisor";

export type ResumeTag =
  | "general"
  | "it-technician"
  | "developer"
  | "supervisor"
  | "operations"
  | "customer-support"
  | "field-operations"
  | "repair"
  | "networking"
  | "leadership";

export type ResumeBullet = {
  text: string;
  tags: ResumeTag[];
};

export type ResumeExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string | null;
  dateRange: string;
  category: "Work" | "Business" | "Internship" | "Education";
  timelineYear: string;
  summary: string;
  tags: ResumeTag[];
  bullets: ResumeBullet[];
};

export type ResumeEducation = {
  id: string;
  title: string;
  institution: string;
  location: string;
  start?: string;
  end?: string;
  dateRange: string;
  category: "Degree" | "Certification" | "Diploma";
  tags: ResumeTag[];
};

export type ResumeCertification = {
  id: string;
  title: string;
  issuer?: string;
  dateRange?: string;
  tags: ResumeTag[];
};

export type ResumeSkillGroup = {
  id: string;
  title: string;
  skills: string[];
  tags: ResumeTag[];
};

export const resumeContact = {
  name: "Alexis Marroquin",
  website: "https://alexismarroquin.nyc",
  location: "Jamaica, NY 11435",

  // For the public website, I would consider hiding phone/email from the page
  // and only showing them in downloadable PDFs.
  phone: "+1 347 626 4771",
  email: "a.marroquin2496@gmail.com",

  links: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/alexis-marroquin886/",
    },
    {
      label: "Portfolio",
      url: "https://alexismarroquin.nyc",
    },
    {
      label: "GitHub",
      url: "https://github.com/deadman2496",
    },
  ],
};

export const resumeFocusProfiles: Record<
  ResumeFocus,
  {
    label: string;
    headline: string;
    summary: string;
    downloadFileName: string;
    preferredTags: ResumeTag[];
  }
> = {
  general: {
    label: "General Resume",
    headline: "Developer • Computer Technician • Operations Leader",
    summary:
      "Experienced technology and operations professional with a background in web development, computer repair, technical support, aviation operations, climate field work, scheduling, and customer-facing troubleshooting.",
    downloadFileName: "alexis-marroquin-resume.pdf",
    preferredTags: ["general"],
  },

  "it-technician": {
    label: "IT Technician Resume",
    headline: "IT Support • Computer Repair • Networking • Troubleshooting",
    summary:
      "Hands-on IT and technical support professional experienced in remote troubleshooting, hardware diagnostics, computer repair, network configuration, customer support, documentation, and device restoration.",
    downloadFileName: "alexis-marroquin-resume-it-technician.pdf",
    preferredTags: [
      "it-technician",
      "repair",
      "networking",
      "customer-support",
    ],
  },

  developer: {
    label: "Developer Resume",
    headline: "Web Developer • Front-End Developer • Software Builder",
    summary:
      "Developer with experience building responsive web applications, database-backed tools, business workflow systems, and user-friendly interfaces using JavaScript, TypeScript, React, Next.js, Node.js, Express, HTML, CSS, Bootstrap, and related web technologies.",
    downloadFileName: "alexis-marroquin-resume-developer.pdf",
    preferredTags: ["developer"],
  },

  supervisor: {
    label: "Supervisor Resume",
    headline: "Operations Supervisor • Dispatcher • Team Coordinator",
    summary:
      "Operations and supervisory professional experienced in scheduling, dispatch, logistics, training, team coordination, safety procedures, customer-facing airline operations, and high-pressure airport environments.",
    downloadFileName: "alexis-marroquin-resume-supervisor.pdf",
    preferredTags: [
      "supervisor",
      "operations",
      "leadership",
      "customer-support",
    ],
  },
};

export const resumeExperience: ResumeExperience[] = [
  {
    id: "technical-support-representative-charter",
    title: "Technical Support Representative",
    company: "Charter Communications",
    location: "Flushing, NY",
    start: "2025-01",
    end: null,
    dateRange: "January 2025 – Present",
    category: "Work",
    timelineYear: "2025",
    summary:
      "Provides remote Tier-1 troubleshooting for internet, Wi-Fi, cable, streaming, modem, router, and endpoint device issues while maintaining strong performance metrics.",
    tags: ["general", "it-technician", "customer-support", "networking"],
    bullets: [
      {
        text: "Maintained 85–93% FCR within a 7-day repeat-contact window, 82–83% speech-analytics sentiment/QA scoring, roughly 600 calls per month, and 600–800 second AHT.",
        tags: ["general", "it-technician", "customer-support"],
      },
      {
        text: "Delivered remote Tier-1 troubleshooting for internet, Wi-Fi, cable, and streaming issues by guiding customers through structured diagnostic steps.",
        tags: ["it-technician", "customer-support", "networking"],
      },
      {
        text: "Diagnosed connectivity issues using modem/event logs and signal health indicators to isolate coax line quality, customer equipment, and endpoint device problems.",
        tags: ["it-technician", "networking"],
      },
      {
        text: "Applied a consistent triage process: reproduce, isolate variables, validate the fix, and document results to reduce repeat contacts.",
        tags: ["it-technician", "customer-support", "general"],
      },
      {
        text: "Documented cases clearly for continuity and escalations, including environment details, steps attempted, results, and next actions.",
        tags: ["it-technician", "customer-support", "general"],
      },
      {
        text: "Maintained strong customer communication quality through speech analytics and live QA monitoring.",
        tags: ["customer-support", "supervisor", "general"],
      },
    ],
  },

  {
    id: "computer-technician-kilobite",
    title: "Computer Technician",
    company: "Kilo Bite LLC",
    location: "Jamaica, NY",
    start: "2021-12",
    end: null,
    dateRange: "December 2021 – Present",
    category: "Business",
    timelineYear: "2021",
    summary:
      "Specializes in board and screen restoration, device repair, troubleshooting, hardware diagnostics, networking, and technical support across desktops, laptops, iPhones, and Android devices.",
    tags: ["general", "it-technician", "repair", "networking"],
    bullets: [
      {
        text: "Specialized in board and screen restoration services for desktops, laptops, iPhones, and Android devices.",
        tags: ["it-technician", "repair"],
      },
      {
        text: "Served as lead technician repairing and troubleshooting complex technical problems, including malfunctioning components and connectivity issues.",
        tags: ["it-technician", "repair", "networking"],
      },
      {
        text: "Established a communication network between Delta, American Airlines, United Airlines, and the Gate Gourmet hub in Atlanta to streamline flight, aircraft, inventory, passenger, and meal-request data.",
        tags: ["it-technician", "networking", "developer", "operations"],
      },
      {
        text: "Reconfigured system-wide printer network settings to improve access for more than 150 users.",
        tags: ["it-technician", "networking"],
      },
    ],
  },

  {
    id: "web-developer-kilobite",
    title: "Web Developer",
    company: "Kilo Bite LLC",
    location: "Jamaica, NY",
    start: "2020-12",
    end: null,
    dateRange: "December 2020 – Present",
    category: "Business",
    timelineYear: "2020",
    summary:
      "Builds responsive websites, front-end interfaces, database-backed business applications, and operational web tools for clients and business workflows.",
    tags: ["general", "developer"],
    bullets: [
      {
        text: "Provided database and front-end support for a Gate Gourmet web application that delivered customer order requirements up to 3 days in advance and improved efficiency by 150%.",
        tags: ["developer", "operations"],
      },
      {
        text: "Created database web applications for COVID-19 protocols, including autonomous employee temperature capture that saved roughly 3 minutes per person.",
        tags: ["developer", "operations"],
      },
      {
        text: "Generated front-end designs using HTML/XHTML, CSS, JavaScript, JSON, Bootstrap 5, SCSS, Node.js, Express.js, and React.",
        tags: ["developer"],
      },
      {
        text: "Built websites and web/mobile application work for customers across construction, steelworks, film festival, and small-business use cases.",
        tags: ["developer", "general"],
      },
      {
        text: "Constructed user-friendly, cross-browser interfaces with scalable front-end solutions.",
        tags: ["developer"],
      },
    ],
  },

  {
    id: "climate-impact-specialist-aclima",
    title: "Climate Impact Specialist & Air Quality Analyst",
    company: "Aclima",
    location: "Queens, NY",
    start: "2022-06",
    end: "2023-10",
    dateRange: "June 2022 – October 2023",
    category: "Work",
    timelineYear: "2022",
    summary:
      "Supported environmental data collection, field operations, route planning, scientific equipment maintenance, and air quality monitoring across New York.",
    tags: ["general", "field-operations", "operations"],
    bullets: [
      {
        text: "Cooperated with agencies and organizations including NYC DEP, U.S. EPA, NYS DEC, Con Edison, and the MTA to monitor air quality across NYC and other New York locations.",
        tags: ["field-operations", "operations", "general"],
      },
      {
        text: "Played an integral role in debriefing the Governor of New York on key environmental issues.",
        tags: ["general", "operations"],
      },
      {
        text: "Analyzed air quality using proprietary scientific instruments tracking 14 environmental parameters including temperature, humidity, hydrocarbons, pollutants, and ozone dispersion.",
        tags: ["field-operations", "it-technician", "general"],
      },
      {
        text: "Mapped complex routes of more than 200 miles while adapting to traffic, road closures, and weather, maintaining a 100% designated time target and safety rating.",
        tags: ["field-operations", "operations", "supervisor"],
      },
      {
        text: "Completed two daily inspections plus monthly maintenance on scientific equipment and company vehicles.",
        tags: ["field-operations", "it-technician", "repair"],
      },
      {
        text: "Collaborated with maintenance teams to resolve equipment and vehicle issues, including four emergency issues during tenure.",
        tags: ["field-operations", "it-technician", "operations"],
      },
    ],
  },

  {
    id: "supervisor-admin-dispatcher-gate-gourmet",
    title: "Supervisor & Assistant Admin Dispatcher",
    company: "Gate Gourmet / Gate Serve LLC",
    location: "New York, NY",
    start: "2019-10",
    end: "2022-04",
    dateRange: "October 2019 – April 2022",
    category: "Work",
    timelineYear: "2019",
    summary:
      "Managed scheduling, dispatching, airline operations, training, logistics, safety procedures, and cross-airport coordination for high-volume aviation catering operations.",
    tags: ["general", "supervisor", "operations", "leadership"],
    bullets: [
      {
        text: "Developed, implemented, and managed schedules for more than 1,000 team members supporting airline quality, safety, timely completion, and proper delivery across more than 300,000 chartered flights.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Directed daily operations for 150 drivers across 55 LaGuardia Airport locations for precise catering procedures.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Led discussions with LaGuardia Airport representatives to address passenger and airline inquiries while adapting product management to individual airline needs.",
        tags: ["supervisor", "operations", "customer-support"],
      },
      {
        text: "Spearheaded operations for both LaGuardia and JFK for a limited period, building processes, schedules, and logistical support with no delays despite limited staffing.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Enforced COVID-19 protocols and procedures while completing multiple complex projects.",
        tags: ["supervisor", "operations"],
      },
      {
        text: "Trained more than 250 new employees and more than 1,000 returning employees across customer service, dispatch, supervisor, and manager roles during pandemic recovery.",
        tags: ["supervisor", "leadership", "operations"],
      },
    ],
  },

  {
    id: "customer-service-representative-gate-gourmet",
    title: "Customer Service Representative",
    company: "Gate Gourmet / Gate Serve LLC",
    location: "New York, NY",
    start: "2018-02",
    end: "2019-10",
    dateRange: "February 2018 – October 2019",
    category: "Work",
    timelineYear: "2018",
    summary:
      "Coordinated directly with airline representatives at aircraft, supported catering operations, trained new employees, and maintained safety and performance standards.",
    tags: ["general", "customer-support", "operations", "supervisor"],
    bullets: [
      {
        text: "Engaged with airline representatives at aircraft to support seamless catering coordination, contributing to 35,050 successful flights with no avoidable delays.",
        tags: ["operations", "customer-support", "supervisor"],
      },
      {
        text: "Loaded and unloaded galley equipment onto catering vehicles and aircraft ranging from Bombardier CRJ200 aircraft to Airbus A321 aircraft while maintaining OSHA and company standards.",
        tags: ["operations", "general"],
      },
      {
        text: "Provided training to four hiring rounds of 30 employees covering airline procedures and equipment use.",
        tags: ["supervisor", "leadership", "operations"],
      },
      {
        text: "Earned Employee of the Month multiple times due to training performance and a 12-month no-delay record.",
        tags: ["general", "supervisor", "operations"],
      },
    ],
  },

  {
    id: "lead-security-coordinator-gatesafe",
    title: "Lead Security Coordinator",
    company: "Gate Safe / ACTS Aviation Security",
    location: "Astoria, NY",
    start: "2017-07",
    end: "2018-02",
    dateRange: "July 2017 – February 2018",
    category: "Work",
    timelineYear: "2017",
    summary:
      "Handled aviation security coordination, scheduling support, equipment maintenance, and internal database/process improvement work.",
    tags: ["general", "supervisor", "operations", "it-technician", "developer"],
    bullets: [
      {
        text: "Monitored designated areas between LaGuardia Airport and the Astoria kitchen hub to identify suspicious activity between key locations.",
        tags: ["operations", "supervisor"],
      },
      {
        text: "Assessed key items in the kitchen hub to ensure prohibited, unidentified, or damaged materials did not leave without proper documentation or removal.",
        tags: ["operations", "supervisor"],
      },
      {
        text: "Maintained company devices including phones, tablets, printers, and computers.",
        tags: ["it-technician", "repair"],
      },
      {
        text: "Created and enforced daily team schedules with supervisor permission to maintain 100% coverage and minimal downtime.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Built a database-supported clock-in process using Visual Basic, SQL, and JavaScript that cut paperwork in half and reduced writing, checking, and downtime by 45% overall.",
        tags: ["developer", "operations", "supervisor"],
      },
    ],
  },

  {
    id: "uber-partner-driver",
    title: "Uber Partner Driver",
    company: "Uber",
    location: "Queens, NY",
    start: "2016-09",
    end: "2017-06",
    dateRange: "September 2016 – June 2017",
    category: "Work",
    timelineYear: "2016",
    summary:
      "Worked part-time while studying at LaGuardia, maintaining a 5-star driver record.",
    tags: ["general", "customer-support"],
    bullets: [
      {
        text: "Operated part-time to support studies at LaGuardia Community College.",
        tags: ["general"],
      },
      {
        text: "Maintained a 5-star driver record with no bad remarks.",
        tags: ["customer-support", "general"],
      },
    ],
  },

  {
    id: "delivery-driver-station-hospitality",
    title: "Delivery Driver",
    company: "Station Hospitality LLC",
    location: "New York, NY",
    start: "2015-12",
    end: "2016-07",
    dateRange: "December 2015 – July 2016",
    category: "Work",
    timelineYear: "2015",
    summary:
      "Supported food delivery, training, inventory, logistics, and warehouse coordination for restaurant operations.",
    tags: ["general", "operations", "supervisor"],
    bullets: [
      {
        text: "Transported food safely and on time across Brooklyn and Queens, completing 10 deliveries within 5–7 minutes of each other per run.",
        tags: ["operations", "customer-support"],
      },
      {
        text: "Created a training program for chefs, delivery drivers, servers, and bartenders that reduced training time to 2–4 days, a 50% decrease.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Created an inventory database using Google Drive, Google Sheets, and Google storage to improve restaurant and warehouse inventory accuracy and reduce supply trips by 25%.",
        tags: ["developer", "operations"],
      },
      {
        text: "Provided logistical support and occasional restock trips while helping keep restaurant and warehouse balances organized.",
        tags: ["operations", "supervisor"],
      },
    ],
  },

  {
    id: "banquet-captain-planit-new-york",
    title: "Banquet Captain / Server",
    company: "Planit New York",
    location: "Corona, NY",
    start: "2015-03",
    end: "2015-09",
    dateRange: "March 2015 – September 2015",
    category: "Work",
    timelineYear: "2015",
    summary:
      "Served and coordinated special events across the New York metropolitan area while supporting task assignment, client communication, and event logistics.",
    tags: ["general", "supervisor", "operations", "customer-support"],
    bullets: [
      {
        text: "Served as a waiter and later organizer for special events across the New York metropolitan area.",
        tags: ["operations", "customer-support"],
      },
      {
        text: "Assigned tasks to servers, bartenders, and venue staff to maintain near-complete coverage and reduce wait time between the kitchen and party tables.",
        tags: ["supervisor", "operations", "leadership"],
      },
      {
        text: "Served as a liaison between the company and potential clients, helping secure contracts, events, and better deals.",
        tags: ["supervisor", "customer-support", "operations"],
      },
      {
        text: "Provided logistical support transporting the team to venues and ensuring event equipment was accounted for.",
        tags: ["operations", "supervisor"],
      },
    ],
  },

  {
    id: "technology-internship-2013",
    title: "Technology Internship",
    company: "Early Career Internship",
    location: "New York, NY",
    start: "2013-01",
    end: "2013-12",
    dateRange: "2013",
    category: "Internship",
    timelineYear: "2013",
    summary:
      "Early-career internship placeholder for the About timeline. Replace this with the exact employer, dates, and details when ready.",
    tags: ["general", "it-technician", "developer"],
    bullets: [
      {
        text: "Started building early workplace experience and technical foundations before high school graduation.",
        tags: ["general", "it-technician", "developer"],
      },
    ],
  },
];

export const resumeEducation: ResumeEducation[] = [
  {
    id: "web-development-certification-city-tech",
    title: "Web Development Certification",
    institution: "CUNY New York City College of Technology",
    location: "Brooklyn, NY",
    start: "2023-04",
    end: "2023-08",
    dateRange: "April 2023 – August 2023",
    category: "Certification",
    tags: ["developer"],
  },

  {
    id: "computer-science-certification-harvard",
    title: "Computer Science Certification",
    institution: "Harvard University",
    location: "Jamaica, NY",
    start: "2020-06",
    end: "2021-06",
    dateRange: "June 2020 – June 2021",
    category: "Certification",
    tags: ["developer", "it-technician"],
  },

  {
    id: "full-stack-developer-certification-york",
    title: "Full Stack Developer Certification",
    institution: "York College",
    location: "New York, NY",
    start: "2018-06",
    end: "2018-12",
    dateRange: "June 2018 – December 2018",
    category: "Certification",
    tags: ["developer"],
  },

  {
    id: "computer-science-associate-laguardia",
    title: "Computer Science Associate's Degree",
    institution: "LaGuardia Community College",
    location: "Long Island City, NY",
    start: "2016-09",
    end: "2017-06",
    dateRange: "September 2016 – June 2017",
    category: "Degree",
    tags: ["developer", "it-technician"],
  },

  {
    id: "high-school-diploma-transit-tech",
    title: "High School Diploma",
    institution: "Transit Tech High School",
    location: "New York, NY",
    end: "2014-06",
    dateRange: "June 2014",
    category: "Diploma",
    tags: ["general"],
  },
];

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    id: "development",
    title: "Development",
    tags: ["developer"],
    skills: [
      "HTML",
      "HTML5",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "Bootstrap",
      "jQuery",
      "PHP",
      "Java",
      "Python",
      "SQL",
      "MySQL",
      "MongoDB",
      "JSON",
      "Git",
      "GitHub",
      "Responsive Web Design",
      "UI Design",
      "Wireframing",
      "Application Development",
      "Full-Stack Development",
      "Front-End Development",
      "Website Maintenance",
    ],
  },

  {
    id: "it-support-networking",
    title: "IT Support & Networking",
    tags: ["it-technician", "networking", "customer-support"],
    skills: [
      "Technical Support",
      "Help Desk Support",
      "Desktop Support",
      "User Support",
      "Microsoft 365 Support",
      "Windows Support",
      "macOS",
      "Linux",
      "Active Directory",
      "VPN",
      "DHCP",
      "DNS",
      "LAN",
      "WAN",
      "IP Networking",
      "TCP",
      "HTTPS",
      "Cisco Routers",
      "Network Routers",
      "Network Configuration",
      "Network Analyzers",
      "Microsoft Windows Server",
      "SCCM",
      "Mobile Device Management",
      "Google Workspace",
      "Operating System Installation",
      "Software Installation",
      "Firmware Updates",
      "Software Troubleshooting",
    ],
  },

  {
    id: "repair-electronics",
    title: "Repair & Electronics",
    tags: ["it-technician", "repair"],
    skills: [
      "Computer Hardware",
      "Desktop Computer Repair",
      "Laptop Troubleshooting",
      "Mobile Phone Repair",
      "Tablet Repair",
      "Smartphone Troubleshooting",
      "Gaming Console Repair",
      "Wearable Device Repair",
      "Consumer Electronics",
      "Electrical Soldering",
      "Micro-Soldering",
      "SMD Repair",
      "PCB Repair",
      "Reflow Soldering",
      "Board Cleaning",
      "Hardware Diagnostics",
      "Failure Analysis",
      "Electronics Functional Testing",
      "Electronics Component Replacement",
      "Electronics Component Testing",
      "Continuity Testing",
      "Signal Tracing",
      "Multimeters",
      "Current Clamps",
      "Capacitors",
      "Diodes",
      "Resistors",
      "Electronic Connectors",
    ],
  },

  {
    id: "operations-leadership",
    title: "Operations & Leadership",
    tags: ["supervisor", "operations", "leadership"],
    skills: [
      "Dispatching",
      "Scheduling",
      "Team Scheduling",
      "Supervising Experience",
      "Project Coordination",
      "Logistics",
      "Warehouse Distribution",
      "Warehouse Management",
      "Quality Control",
      "Customer Service",
      "Customer Support",
      "Technical Support via Phone",
      "Administrative Experience",
      "Time Management",
      "Attention to Detail",
      "Teamwork",
      "Training",
      "Food Service",
      "Banquet Experience",
      "Kitchen Management",
      "Driving",
    ],
  },

  {
    id: "business-marketing",
    title: "Business, Marketing & Design",
    tags: ["general", "developer", "supervisor"],
    skills: [
      "WordPress",
      "Website Management",
      "Website Design Projects",
      "SEO",
      "Google Ads",
      "Google Analytics",
      "Facebook Advertising",
      "Digital Marketing",
      "Email Marketing",
      "Canva",
      "Logo Design",
      "Visual Design",
      "Graphic Design Illustration",
      "User Research",
      "Microsoft Office",
      "Microsoft Excel",
      "Microsoft Word",
      "Microsoft Access",
      "Google Docs",
      "ChatGPT",
    ],
  },
];

export const resumeCertifications: ResumeCertification[] = [
  {
    id: "full-stack-web-development",
    title: "Full Stack Web Development",
    issuer: "New York City College of Technology",
    dateRange: "August 2023 – Present",
    tags: ["developer"],
  },

  {
    id: "comptia-a-plus",
    title: "CompTIA A+",
    issuer: "CompTIA",
    tags: ["it-technician"],
  },

  {
    id: "comptia-network-plus",
    title: "CompTIA Network+",
    issuer: "CompTIA",
    tags: ["it-technician", "networking"],
  },

  {
    id: "comptia-security-plus",
    title: "CompTIA Security+",
    issuer: "CompTIA",
    tags: ["it-technician", "networking"],
  },

  {
    id: "sscp",
    title: "SSCP",
    tags: ["it-technician", "networking"],
  },

  {
    id: "aircraft-dispatcher",
    title: "Aircraft Dispatcher",
    tags: ["supervisor", "operations"],
  },

  {
    id: "class-d-driver-license",
    title: "Class D Driver's License",
    tags: ["operations", "general"],
  },
];

export const resumeLanguages = [
  {
    language: "English",
    proficiency: "Fluent",
  },
  {
    language: "Spanish",
    proficiency: "Fluent",
  },
];

export function getRelevantBullets(
  experience: ResumeExperience,
  focus: ResumeFocus,
  maxBullets = 5,
): ResumeBullet[] {
  if (focus === "general") {
    return experience.bullets.slice(0, maxBullets);
  }

  const preferredTags = resumeFocusProfiles[focus].preferredTags;

  const exactMatches = experience.bullets.filter((bullet) =>
    bullet.tags.some((tag) => preferredTags.includes(tag)),
  );

  const generalMatches = experience.bullets.filter(
    (bullet) => bullet.tags.includes("general") && !exactMatches.includes(bullet),
  );

  return [...exactMatches, ...generalMatches].slice(0, maxBullets);
}

export function getRelevantExperience(focus: ResumeFocus): ResumeExperience[] {
  if (focus === "general") {
    return resumeExperience;
  }

  const preferredTags = resumeFocusProfiles[focus].preferredTags;

  return resumeExperience.filter((experience) =>
    experience.tags.some((tag) => preferredTags.includes(tag)),
  );
}

export function getRelevantSkills(focus: ResumeFocus): ResumeSkillGroup[] {
  if (focus === "general") {
    return resumeSkillGroups;
  }

  const preferredTags = resumeFocusProfiles[focus].preferredTags;

  return resumeSkillGroups.filter((group) =>
    group.tags.some((tag) => preferredTags.includes(tag)),
  );
}

export function getRelevantEducation(focus: ResumeFocus): ResumeEducation[] {
  if (focus === "general") {
    return resumeEducation;
  }

  const preferredTags = resumeFocusProfiles[focus].preferredTags;

  return resumeEducation.filter(
    (education) =>
      education.tags.some((tag) => preferredTags.includes(tag)) ||
      education.tags.includes("general"),
  );
}

export function getRelevantCertifications(
  focus: ResumeFocus,
): ResumeCertification[] {
  if (focus === "general") {
    return resumeCertifications;
  }

  const preferredTags = resumeFocusProfiles[focus].preferredTags;

  return resumeCertifications.filter((certification) =>
    certification.tags.some((tag) => preferredTags.includes(tag)),
  );
}

export function getFilteredResume(focus: ResumeFocus = "general") {
  return {
    focus,
    contact: resumeContact,
    profile: resumeFocusProfiles[focus],
    experience: getRelevantExperience(focus).map((experience) => ({
      ...experience,
      bullets: getRelevantBullets(experience, focus),
    })),
    education: getRelevantEducation(focus),
    skillGroups: getRelevantSkills(focus),
    certifications: getRelevantCertifications(focus),
    languages: resumeLanguages,
  };
}

function getTimelineEndDate(item: {
  start?: string;
  end?: string | null;
}) {
  // Current / ongoing roles should appear at the end of an oldest-to-newest timeline.
  if (item.end === null) {
    return "9999-12";
  }

  // Completed roles/courses sort by their actual end date.
  if (item.end) {
    return item.end;
  }

  // If no end exists, fall back to start.
  if (item.start) {
    return item.start;
  }

  return "0000-00";
}

function getTimelineYearLabel(item: {
  start?: string;
  end?: string | null;
}) {
  if (item.end === null) {
    return "Now";
  }

  if (item.end) {
    return item.end.slice(0, 4);
  }

  if (item.start) {
    return item.start.slice(0, 4);
  }

  return "";
}

export function getAboutTimelineItems() {
  const workTimelineItems: ResumeExperience[] = resumeExperience.map(
    (experience) => ({
      ...experience,

      // This changes the dot/year from "when it started"
      // to "when it ended/completed".
      timelineYear: getTimelineYearLabel(experience),
    }),
  );

  const educationTimelineItems: ResumeExperience[] = resumeEducation.map(
    (education) => ({
      id: education.id,
      title: education.title,
      company: education.institution,
      location: education.location,
      start: education.start ?? education.end ?? "",
      end: education.end ?? null,
      dateRange: education.dateRange,
      category: "Education" as const,
      timelineYear: getTimelineYearLabel(education),
      summary: `${education.title} at ${education.institution}.`,
      tags: education.tags,
      bullets: [
        {
          text: `${education.category}: ${education.dateRange}`,
          tags: education.tags,
        },
      ],
    }),
  );

  return [...workTimelineItems, ...educationTimelineItems].sort((a, b) => {
    const aEnd = getTimelineEndDate(a);
    const bEnd = getTimelineEndDate(b);

    const endCompare = aEnd.localeCompare(bEnd);

    if (endCompare !== 0) {
      return endCompare;
    }

    // Tie-breaker: if two items ended around the same time,
    // sort by their start date.
    const aStart = a.start || "0000-00";
    const bStart = b.start || "0000-00";

    return aStart.localeCompare(bStart);
  });
}