import { motion } from 'framer-motion';
import { useContributions } from '../hooks/useContributions';

export default function Menu({ onNavigate }) {
  const { stats, loading } = useContributions();

  const menuItems = [
    {
      id: 'wall',
      title: 'Visit the Monument',
      description: 'Explore the infinite canvas of human expression',
      icon: '🌍',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 'contribute',
      title: 'Contribute / Claim a Spot',
      description: 'Leave your mark on the digital monument',
      icon: '✨',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 'find',
      title: 'Find Your Contribution',
      description: 'Locate your tile using your unique ID',
      icon: '🔍',
      gradient: 'from-pink-500 to-red-600',
    },
    {
      id: 'about',
      title: 'Why This Exists',
      description: 'Learn about the vision behind the monument',
      icon: '💭',
      gradient: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight">
          The Human Monument
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light">
          A living tapestry of humanity's stories
        </p>
      </motion.div>

      {/* Stats */}
      {!loading && stats && (
        <motion.div
          className="glass px-8 py-4 rounded-full mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p className="text-monument-accent text-lg font-semibold">
            {stats.total.toLocaleString()} contributions and counting
          </p>
        </motion.div>
      )}

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
            />

            {/* Glass Effect */}
            <div className="absolute inset-0 glass" />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-monument-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {item.description}
              </p>
            </div>

            {/* Hover Arrow */}
            <motion.div
              className="absolute bottom-4 right-4 text-monument-accent text-2xl"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
            >
              →
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="mt-16 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Open Source • Built for Humanity • 2025-2028</p>
      </motion.div>
    </div>
  );
}