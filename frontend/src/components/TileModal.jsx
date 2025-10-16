import { motion } from 'framer-motion';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function TileModal({ contribution, onClose }) {
  const [audioPlaying, setAudioPlaying] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {contribution.type} Contribution
            </h3>
            <p className="text-sm text-gray-400">
              ID: <span className="font-mono text-monument-accent">{contribution.shortId}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="bg-monument-dark rounded-lg p-6 mb-6">
          {contribution.type === 'TEXT' && (
            <p className="text-white text-lg whitespace-pre-wrap">
              {contribution.content}
            </p>
          )}

          {contribution.type === 'IMAGE' && contribution.imagePath && (
            <img
              src={`${API_BASE}${contribution.imagePath}`}
              alt="Contribution"
              className="w-full rounded-lg"
            />
          )}

          {contribution.type === 'DRAWING' && contribution.drawingPath && (
            <img
              src={`${API_BASE}${contribution.drawingPath}`}
              alt="Drawing"
              className="w-full rounded-lg"
            />
          )}

          {contribution.type === 'AUDIO' && contribution.audioPath && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                {audioPlaying ? '🔊' : '🎙️'}
              </div>
              <audio
                src={`${API_BASE}${contribution.audioPath}`}
                controls
                className="w-full"
                onPlay={() => setAudioPlaying(true)}
                onPause={() => setAudioPlaying(false)}
                onEnded={() => setAudioPlaying(false)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p>Created on {formatDate(contribution.createdAt)}</p>
          <p>Position: ({Math.round(contribution.x)}, {Math.round(contribution.y)})</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-primary w-full mt-6"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}