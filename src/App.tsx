import { useState, useEffect } from 'react';
import DesktopView from './components/DesktopView';
import MobileView from './components/MobileView';
import './index.css';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container heavy-cursor">
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}

export default App;
