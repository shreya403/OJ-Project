import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ProblemProvider from './components/problems/problemProvider';
import  { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId='process.env.GOOGLE_CLIENT_ID'>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Toaster />
          <ProblemProvider>
            <App />
          </ProblemProvider>
        </BrowserRouter>
      </PersistGate>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

