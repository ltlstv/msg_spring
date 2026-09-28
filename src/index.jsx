import React from 'react';
import ReactDOM from 'react-dom/client';
import Messenger from './Messenger';
import BlogPage from './BlogPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Messenger />} />
        <Route path="/:username/blog" element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
