import { motion } from 'framer-motion';
import { Layers, Heart, Archive, Github, Lightbulb } from 'lucide-react';

export default function About({ onBack }) {
  const sections = [
    {
      icon: Layers,
      title: "How It Works",
      content: `You can contribute in four ways:

• Text — Share your thoughts, stories, or reflections.
• Drawing — Express visually on a digital canvas.
• Audio — Speak your truth in your own voice.
• Image — Capture a moment or a feeling through a photo.

You can choose to sign your name or remain anonymous. After contributing, you'll receive a unique code to return and find your block on the monument whenever you wish.`
    },
    {
      icon: Heart,
      title: "Why",
      content: `This project exists because I believe we're living through a turning point in human history. Our species is evolving, technology is accelerating, and one day we may reach the stars. But these years — right now — are a part of the story too.

We live in a world driven by capitalism, culture, conflict, and connection. Amid all the chaos, humanity continues to move forward. The Human Monument will capture this era, preserving it as a living digital time capsule.`
    },
    {
      icon: Archive,
      title: "Preservation",
      content: `The monument will remain open for 2 years, gathering voices from around the world.

After that, it will be sealed and moved to the blockchain, preserved for 100+ years, so future generations — or even future civilizations — can look back and understand what it was like to be human here and now.`
    },
    {
      icon: Github,
      title: "Open Source",
      content: `This project is open source on GitHub. Anyone with the skills, passion, or curiosity can contribute to make it better. This is a collective monument built by humanity — not by one person.`
    }
  ];

  return (
    <div className="w-full h-screen bg-monument-darker overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="btn-secondary mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          ← Back to Menu
        </motion.button>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            The Human Monument
          </h1>
          <p className="text-2xl md:text-3xl text-monument-accent font-light">
            A Digital Time Capsule for Humanity
          </p>
        </motion.div>

        {/* Main Statement */}
        <motion.div
          className="glass rounded-2xl p-8 md:p-12 mb-12 space-y-6 text-lg text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p>
            Being human is one of the most extraordinary experiences in the universe.
            Since the dawn of time, humanity has walked an incredible journey — filled with both breathtaking beauty and unimaginable darkness.
          </p>

          <p>
            I'm 29 years old. In my short time on this planet, I've seen, heard, and felt both the ugliness and the wonder of the world we live in. Every single one of us walks a path no one else can truly understand. Some lives are hard, some are joyful. Some stories are loud, others quiet. But together, we all shape the era we live in.
          </p>

          <p className="text-xl font-semibold text-white">
            And what an era this is.
          </p>

          <p>
            These times we're living through — strange, chaotic, revolutionary — may very well be some of the most defining moments in human history.
          </p>
        </motion.div>

        {/* The Idea */}
        <motion.div
          className="glass rounded-2xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-monument-accent/20 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-monument-accent" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                The Idea
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  The Human Monument is a digital monument built to capture what it means to be human in this time period — the years <span className="text-monument-accent font-semibold">2025 to 2028</span>.
                </p>

                <p>
                  It's a global wall, open to every human being, without restrictions or boundaries. A space for anyone to express their thoughts, feelings, ideas, emotions, or anything else they wish to leave behind for the future.
                </p>

                <p className="text-white font-medium">
                  This is not just for those who live online. If you meet someone without internet access, I encourage you to hand them your device and let them add their voice too. Every human story matters.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections with Icons */}
        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                className="glass rounded-2xl p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-monument-accent/20 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-monument-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {section.title}
                    </h3>
                    <div className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Closing Quote */}
        <motion.div
          className="mt-16 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <blockquote className="glass rounded-2xl p-8 md:p-12">
            <p className="text-2xl md:text-3xl text-white font-light italic mb-4">
              "We are all stories in the making. Let's make sure ours is remembered."
            </p>
            <p className="text-monument-accent text-lg">
              — The Human Monument
            </p>
          </blockquote>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <button
            onClick={onBack}
            className="btn-primary text-lg px-8 py-4"
          >
            🌐 Join the Monument
          </button>
          <a
            href="https://github.com/yourusername/the-human-monument"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-lg px-8 py-4 text-center"
          >
            💻 View on GitHub
          </a>
        </motion.div>
      </div>
    </div>
  );
}