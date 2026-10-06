import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchContent } from '../api';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch from /blogs (plural) to match the backend CRUD endpoint
    fetchContent('/blogs').then(res => {
      let apiData = [];
      if (res && res.data && Array.isArray(res.data)) {
        apiData = res.data;
      } else if (Array.isArray(res)) {
        apiData = res;
      }

      // If backend returned actual rows from the MySQL table
      if (apiData.length > 0) {
        const formattedBlogs = apiData.map((blog: any) => ({
          id: blog.id || blog._id,
          title: blog.title || "Untitled",
          excerpt: blog.content ? blog.content.substring(0, 150) + "..." : "No description available.",
          date: blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "Just now",
          readTime: "5 min read", // Approximate
          image: blog.cover_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
        }));
        setPosts(formattedBlogs);
      } else {
        // Fallback dummy data if backend is empty
        setPosts([
          {
            id: 1,
            title: "Building Scalable React Applications",
            excerpt: "Learn the best practices and architectural patterns for building large-scale React applications that are easy to maintain and scale.",
            date: "Oct 1, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
          },
          {
            id: 2,
            title: "Mastering Tailwind CSS",
            excerpt: "Discover how to leverage the full power of Tailwind CSS to rapidly build modern, responsive user interfaces without leaving your HTML.",
            date: "Sep 15, 2026",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"
          },
          {
            id: 3,
            title: "The Future of Web Development",
            excerpt: "Explore upcoming trends and technologies that will shape the future of web development in the coming years.",
            date: "Aug 28, 2026",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop"
          }
        ]);
      }
    }).catch(() => {
      // Catch network errors and set fallback
      setPosts([
        {
          id: 1,
          title: "Building Scalable React Applications",
          excerpt: "Network Error fallback.",
          date: "Today",
          readTime: "1 min read",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"
        }
      ]);
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
        <span className="text-primary font-mono text-xl">05.</span> Latest Articles
        <div className="h-px bg-white/10 flex-grow ml-4 max-w-xs"></div>
      </h2>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {posts.map((post) => (
          <motion.li key={post.id} variants={item} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 list-none flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{post.excerpt}</p>
              <a href="#" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-mono text-sm mt-auto">
                Read More <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.li>
        ))}
      </motion.div>
    </motion.div>
  );
}
