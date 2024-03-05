/* eslint-disable import/extensions */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
// import './style.css';

const container = document.getElementById('react-app');
const root = createRoot(container);
root.render(
      <App />
);