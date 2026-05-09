import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerLicense } from '@syncfusion/ej2-base';
import App from './App';
import './index.css';

// Register Syncfusion License Globally
registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE);

import './styles/syncfusion.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
