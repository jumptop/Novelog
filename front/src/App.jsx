import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SurveyPage from './pages/SurveyPage';
import RecommendationPage from './pages/RecommendationPage';
import BookDetailPage from './pages/BookDetailPage';
import ProfilePage from './pages/ProfilePage';
import JournalPage from './pages/JournalPage';
import JournalListPage from './pages/JournalListPage';
import JournalDetailPage from './pages/JournalDetailPage'; // JournalDetailPage 임포트
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/journal/new" element={<JournalPage />} />
          <Route path="/journals" element={<JournalListPage />} />
          <Route path="/journal/:id" element={<JournalDetailPage />} /> {/* JournalDetailPage 라우트 추가 */}
          <Route path="/book/:isbn" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
