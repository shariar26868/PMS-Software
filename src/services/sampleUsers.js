// Initial Preset Users for the Project Management System

export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    name: 'Admin / Project Manager',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    devRole: 'Lead Tech Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    assignedProjectIds: ['all'],
    bio: 'Oversees software architecture, project timelines, sprint planning, and team workload balance across all projects.',
    skills: ['Project Management', 'Architecture', 'System Design', 'Agile/Scrum'],
    notes: 'Handles client deliverables and resource allocation.'
  },
  {
    id: 'usr-sarah',
    name: 'Sarah Jenkins',
    username: 'sarah',
    password: 'dev123',
    role: 'developer',
    devRole: 'Full Stack Dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    assignedProjectIds: ['proj-kichu-kori'],
    bio: 'Full Stack developer specializing in React frontend systems, Node.js REST APIs, and UI component libraries.',
    skills: ['React', 'Node.js', 'Express', 'TailwindCSS', 'REST APIs'],
    notes: 'Focused on UI design and frontend API integrations.'
  },
  {
    id: 'usr-alex',
    name: 'Alex Rivera',
    username: 'alex',
    password: 'dev123',
    role: 'developer',
    devRole: 'Lead Backend Eng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    assignedProjectIds: ['proj-kichu-kori'],
    bio: 'Backend Specialist with experience in database optimization, microservice communication, and authentication systems.',
    skills: ['Node.js', 'MongoDB', 'PostgreSQL', 'JWT', 'GraphQL'],
    notes: 'Primary owner of database schemas and backend security.'
  },
  {
    id: 'usr-michael',
    name: 'Michael Chang',
    username: 'michael',
    password: 'dev123',
    role: 'developer',
    devRole: 'DevOps & Backend',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    assignedProjectIds: ['proj-kichu-kori'],
    bio: 'Infrastructure and DevOps Engineer focused on CI/CD pipelines, Docker containerization, and cloud environment configs.',
    skills: ['Docker', 'AWS', 'CI/CD', 'Redis', 'Node.js'],
    notes: 'Manages staging deployment and vault environment parameters.'
  },
  {
    id: 'usr-elena',
    name: 'Elena Rostova',
    username: 'elena',
    password: 'dev123',
    role: 'developer',
    devRole: 'Frontend Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    assignedProjectIds: ['proj-kichu-kori'],
    bio: 'Frontend Architect focused on state management, responsive UI design systems, dynamic charts, and client-side performance.',
    skills: ['React', 'TypeScript', 'State Management', 'Gantt Charts', 'UX Design'],
    notes: 'Leads complex UI module development and design system guidelines.'
  }
];
