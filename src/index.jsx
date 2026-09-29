import React from 'react';
import ReactDOM from 'react-dom/client';
import MessengerPage from './MessengerPage';
import BlogPage from './BlogPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MessengerPage />} />
        <Route path="/:username/blog" element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
