import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import SurveyPage from './pages/SurveyPage'; // SurveyPage를 import 합니다.
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          {/* 설문 페이지를 위한 경로를 추가합니다. */}
          <Route path="/survey" element={<SurveyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
