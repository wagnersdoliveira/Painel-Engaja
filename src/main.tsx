import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { OAuthCallbackPage } from './components/OAuthCallbackPage.tsx';
import './index.css';

const isCallback = window.location.pathname.startsWith('/auth/callback') || window.location.pathname.startsWith('/auth/connect');

createRoot(document.getElementById('root')!).render(
  isCallback ? <OAuthCallbackPage /> : <App />
);

