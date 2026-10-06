import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';
import { Code, Layout, Smartphone, Server } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  const icons: Record<string, any> = {
    Code: <Code className="w-8 h-8 text-primary" />,
    Layout: <Layout className="w-8 h-8 text-primary" />,
    Smartphone: <Smartphone className="w-8 h-8 text-primary" />,
    Server: <Server className="w-8 h-8 text-primary" />
  };

  useEffect(() => {
    fetchContent('/services').then(res => {
      setServices(res || [
        { icon: "Layout", title: "Web Design", description: "Creating beautiful, responsive, and intuitive user interfaces that engage users." },
        { icon: "Code", title: "Web Development", description: "Building robust, scalable, and high-performance web applications using modern technologies." },
        { icon: "Smartphone", title: "Mobile Apps", description: "Developing cross-platform mobile applications for iOS and Android devices." },
        { icon: "Server", title: "Backend Development", description: "Designing secure and scalable server-side architectures and APIs." }
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
        <span className="text-primary font-mono text-xl">05.</span> Services
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 p-8 rounded-xl transition-all duration-300 hover:border-primary/50"
          >
            <div className="mb-6 bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
              {icons[service.icon] || <Code className="w-8 h-8 text-primary" />}
            </div>
            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
            <p className="text-gray-400">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
