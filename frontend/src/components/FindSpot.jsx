import { useState } from 'react';
import { motion } from 'framer-motion';
import { contributionAPI } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';

export default function FindSpot({ onBack, onFound }) {
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFind = async (e) => {
    e.preventDefault();
    
    if (!inputId.trim()) {
      setError('Please enter a contribution ID');
      return;
    }

    // Format ID if needed
    let searchId = inputId.trim().toUpperCase();
    if (!searchId.startsWith('HM-')) {
      searchId = `HM-${searchId}`;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await contributionAPI.getByShortId(searchId);
      onFound(response.data);
    } catch (err) {
      setError(err.message || 'Contribution not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-12 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-4xl font-bold mb-4 text-white">
            Find Your Contribution
          </h2>
          <p className="text-xl text-gray-400">
            Enter your unique ID to locate your spot on the monument
          </p>
        </div>

        <form onSubmit={handleFind} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Contribution ID (e.g., HM-ABC123 or just ABC123)
            </label>
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value);
                setError(null);
              }}
              placeholder="Enter your ID..."
              className="w-full bg-monument-dark border border-gray-700 rounded-lg px-6 py-4 text-white text-xl font-mono uppercase focus:outline-none focus:border-monument-accent transition-colors"
              disabled={loading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500 rounded-lg p-4"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              ← Back to Menu
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading || !inputId.trim()}
            >
              {loading ? 'Searching...' : 'Find My Spot'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500 text-center">
            💡 Tip: Your ID was provided when you created your contribution.
            <br />
            If you lost it, try checking your browser history or screenshots!
          </p>
        </div>
      </motion.div>

      {loading && <LoadingSpinner message="Searching for your contribution..." />}
    </div>
  );
}