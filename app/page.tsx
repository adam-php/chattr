'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const glowVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (session) {
      router.push('/chat');
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{
              rotate: 360,
              borderColor: ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--primary))']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-12 w-12 rounded-full border-2 border-t-transparent"
          />
          <motion.p
            variants={glowVariants}
            initial="initial"
            animate="animate"
            className="mt-4 text-muted-foreground text-glow"
          >
            Loading Chattr...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MessageSquare className="h-12 w-12 text-primary text-glow" />
            </motion.div>
            <h1 className="text-5xl font-bold text-glow">Chattr</h1>
          </motion.div>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-md mx-auto"
          >
            Connect and chat with people around the world in real-time
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              className="px-8 cyberpunk-border glow bg-primary/20 hover:bg-primary/30 transition-all duration-300"
              onClick={() => router.push('/auth')}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </AnimatePresence>
  );
}