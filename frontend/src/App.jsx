import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Menu from './components/Menu';
import InfiniteWall from './components/InfiniteWall';
import ContributeCanvas from './components/ContributeCanvas';
import FindSpot from './components/FindSpot';
import About from './components/About';

function App() {
  const [view, setView] = useState('menu'); // 'menu', 'wall', 'contribute', 'find', 'about'
  const [targetTile, setTargetTile] = useState(null);

  const handleViewChange = (newView, data = null) => {
    setView(newView);
    if (data) {
      setTargetTile(data);
    }
  };

  const handleFindTile = (tileData) => {
    setTargetTile(tileData);
    setView('wall');
  };

  return (
    <div className="w-full h-full relative bg-monument-darker">
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Menu onNavigate={handleViewChange} />
          </motion.div>
        )}

        {view === 'wall' && (
          <motion.div
            key="wall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <InfiniteWall 
              onBack={() => handleViewChange('menu')} 
              targetTile={targetTile}
              onTargetReached={() => setTargetTile(null)}
            />
          </motion.div>
        )}

        {view === 'contribute' && (
          <motion.div
            key="contribute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ContributeCanvas onBack={() => handleViewChange('menu')} />
          </motion.div>
        )}

        {view === 'find' && (
          <motion.div
            key="find"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <FindSpot 
              onBack={() => handleViewChange('menu')}
              onFound={handleFindTile}
            />
          </motion.div>
        )}

        {view === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <About onBack={() => handleViewChange('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;