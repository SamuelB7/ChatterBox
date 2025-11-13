/**
 * App Component
 * Main application with routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ConversationPage } from './pages/ConversationPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conversation/:id" element={<ConversationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
