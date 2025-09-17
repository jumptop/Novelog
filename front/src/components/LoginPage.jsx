import React, { useEffect, useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    // URL 파라미터에서 에러 확인
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'true') {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }

    // 로그인 상태 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        // 이미 로그인된 상태면 메인 페이지로 이동
        window.location.href = '/main';
      }
    } catch (error) {
      console.log('로그인 상태 확인 중 오류:', error);
    }
  };

  const handleGoogleLogin = () => {
    // OAuth2 Google 로그인 URL로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Novelog</h1>
          <p className="login-subtitle">소설로 시작하는 책읽기</p>
        </div>
        
        <div className="login-content">
          <h2>로그인</h2>
          <p>Google 계정으로 간편하게 로그인하세요</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button 
            className="google-login-btn"
            onClick={handleGoogleLogin}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 로그인
          </button>
        </div>
        
        <div className="login-footer">
          <p>로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
