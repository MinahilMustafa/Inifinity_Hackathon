// Seed demo accounts as specified in the hackathon brief
export const DEMO_USERS = [
  {
    id: "ADMIN",
    name: "Admin",
    email: "admin@novaworks.example",
    role: "ADMIN",
    specialization: "Administrator",
    skills: ["Company overview", "transcript creation"],
    password: "Demo123!"
  },
  {
    id: "PM01",
    name: "Ayesha Khan",
    email: "ayesha@novaworks.example",
    role: "MANAGER",
    specialization: "Manager / Web PM",
    skills: ["Web projects", "client coordination"],
    password: "Demo123!"
  },
  {
    id: "PM02",
    name: "Bilal Ahmed",
    email: "bilal@novaworks.example",
    role: "MANAGER",
    specialization: "Manager / Mobile PM",
    skills: ["Mobile projects", "delivery planning"],
    password: "Demo123!"
  },
  {
    id: "PM03",
    name: "Hina Malik",
    email: "hina@novaworks.example",
    role: "MANAGER",
    specialization: "Manager / AI PM",
    skills: ["AI projects", "requirement review"],
    password: "Demo123!"
  },
  {
    id: "DEV01",
    name: "Ali Raza",
    email: "ali@novaworks.example",
    role: "AGENT",
    specialization: "Agent / Full-Stack",
    skills: ["React", "frontend integration"],
    password: "Demo123!"
  },
  {
    id: "DEV02",
    name: "Hamza Shah",
    email: "hamza@novaworks.example",
    role: "AGENT",
    specialization: "Agent / Full-Stack",
    skills: ["Node.js", "databases", "APIs"],
    password: "Demo123!"
  },
  {
    id: "DEV03",
    name: "Sara Noor",
    email: "sara@novaworks.example",
    role: "AGENT",
    specialization: "Agent / App Developer",
    skills: ["Flutter", "mobile UI"],
    password: "Demo123!"
  },
  {
    id: "DEV04",
    name: "Usman Tariq",
    email: "usman@novaworks.example",
    role: "AGENT",
    specialization: "Agent / App Developer",
    skills: ["Flutter", "integration", "testing"],
    password: "Demo123!"
  },
  {
    id: "DEV05",
    name: "Zain Abbas",
    email: "zain@novaworks.example",
    role: "AGENT",
    specialization: "Agent / AI Developer",
    skills: ["LLMs", "extraction", "prompts"],
    password: "Demo123!"
  },
  {
    id: "DEV06",
    name: "Maryam Asif",
    email: "maryam@novaworks.example",
    role: "AGENT",
    specialization: "Agent / AI Developer",
    skills: ["Retrieval", "document processing"],
    password: "Demo123!"
  }
];

export async function seedUsers() {
  console.log("Seeding demo users...");
  // Seeder logic upserting DEMO_USERS without duplicate entries
}
