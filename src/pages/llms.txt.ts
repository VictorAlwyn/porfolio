import type { APIRoute } from 'astro';
import { education, experience, profile, projects, skills } from '../data/resume';

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const body = [
    `# ${profile.name}`,
    '',
    `> ${profile.title}. ${profile.tagline}. Based in the ${profile.location}, working remotely with teams in the United States, Canada and the United Kingdom.`,
    '',
    ...profile.bio,
    '',
    `- Website: ${abs('/')}`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- Resume (PDF): ${abs('/resume.pdf')}`,
    '',
    '## Projects',
    '',
    ...projects.map((p) => `- [${p.title}](${abs(`/quests/${p.slug}`)}): ${p.summary} (${p.role}, ${p.period})`),
    '',
    '## Experience',
    '',
    ...experience.map((r) => `- ${r.role}, ${r.company}${r.location ? ` (${r.location})` : ''}, ${r.start} – ${r.end}`),
    '',
    '## Skills',
    '',
    ...skills.map((g) => `- ${g.name}: ${g.items.join(', ')}`),
    '',
    '## Education',
    '',
    `- ${education.degree}, ${education.school}, ${education.location} (${education.years})`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
