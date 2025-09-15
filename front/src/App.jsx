import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SurveyPage from './pages/SurveyPage';
import RecommendationPage from './pages/RecommendationPage';
import BookDetailPage from './pages/BookDetailPage';
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
          {/* 상세 페이지 주소를 다시 ISBN 기반으로 변경 */}
          <Route path="/book/:isbn" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
