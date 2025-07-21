import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './index.css';

// Import test utilities for debugging (development only)
if (import.meta.env.DEV) {
  import('./utils/testSupabase.js');
  import('./utils/fixMissingTitles.js');
  import('./utils/quickTitleFix.js');
}

createRoot(document.getElementById('root')).render(<App />);