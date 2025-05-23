import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { Routes } from './Routes/Routes.jsx';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import { Toaster } from 'react-hot-toast';
import { ProjectsCreateProvider } from './contexts/ProjectsCreateContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ProjectsCreateProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 1500 }}
        />
        <RouterProvider router={Routes} />
      </ProjectsCreateProvider>
    </Provider>
  </React.StrictMode>
);
