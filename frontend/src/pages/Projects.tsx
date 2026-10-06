import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchContent('/projects').then(res => {
      setProjects(res || [
        {
          id: 1,
          title: "E-Commerce Platform",
          description: "A full-stack e-commerce solution with real-time inventory, secure payments, and an intuitive admin dashboard.",
          tech: ["React", "Node.js", "MongoDB", "Stripe"],
          github: "#",
          external: "#",
          image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop"
        },
        {
          id: 2,
          title: "Task Management App",
          description: "A collaborative task management tool with real-time updates, kanban boards, and team analytics.",
          tech: ["TypeScript", "Next.js", "Tailwind", "Supabase"],
          github: "#",
          external: "#",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
        }
      ]);
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
        <span className="text-primary font-mono text-xl">02.</span> Some Things I've Built
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <div className="space-y-24">
        {projects.map((project, index) => (
          <div key={project.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-3/5">
              <div className="relative group rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 duration-300"></div>
                <img src={project.image_url} alt={project.title} className="w-full h-[300px] object-cover" />
              </div>
            </div>
            
            <div className={`w-full md:w-2/5 flex flex-col ${index % 2 !== 0 ? 'md:items-start' : 'md:items-end'} text-left md:text-right`}>
              <p className="text-primary font-mono mb-2">Featured Project</p>
              <h3 className="text-2xl font-bold mb-6 hover:text-primary transition-colors">{project.title}</h3>
              
              <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10 mb-6 z-20">
                <p className="text-gray-300">{project.description}</p>
              </div>
              
              <ul className={`flex flex-wrap gap-4 font-mono text-sm text-gray-400 mb-6 ${index % 2 !== 0 ? 'justify-start' : 'md:justify-end'}`}>
                {['React', 'Node.js'].map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              
              <div className="flex gap-4">
                <a href={project.github_url} className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                <a href={project.project_url} className="hover:text-primary transition-colors"><ExternalLink className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
