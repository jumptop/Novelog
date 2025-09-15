import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SurveyPage from './pages/SurveyPage';
import RecommendationPage from './pages/RecommendationPage';
import BookDetailPage from './pages/BookDetailPage'; // 새로 만들 페이지 import
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
          {/* 책 상세 페이지를 위한 동적 라우트 추가 */}
          <Route path="/book/:isbn" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
