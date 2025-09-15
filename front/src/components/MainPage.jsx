import React, { useEffect, useState } from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData && !userData.surveyCompleted) {
          window.location.href = '/survey';
        } else {
          setUser(userData);
        }
      } else if (response.status === 401) {
        window.location.href = '/login';
      } else {
        console.error('사용자 정보 조회 실패:', response.status);
      }
    } catch (error) {
      console.error('사용자 상태 확인 중 오류:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };

  const handleResetSurvey = async () => {
    if (!confirm('정말로 설문 상태를 초기화하시겠습니까? 다시 로그인해야 합니다.')) {
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/user/me/reset-survey', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('설문 상태가 초기화되었습니다. 다시 로그인해주세요.');
        handleLogout();
      } else {
        const errorText = await response.text();
        alert(`초기화에 실패했습니다: ${errorText}`);
      }
    } catch (error) {
      console.error('설문 초기화 중 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  const handleSearch = () => {
    if (!query) {
      alert('검색어를 입력해주세요.');
      return;
    }
    setLoading(true);
    setBooks([]);

    fetch(`http://localhost:8080/api/search/books?query=${query}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data.items || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("API 호출 중 오류 발생:", error);
        alert('책 정보를 가져오는 데 실패했습니다.');
        setLoading(false);
      });
  };

  const handleReset = () => {
    setQuery('');
    setBooks([]);
    window.scrollTo(0, 0);
  }

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>사용자 정보를 확인하는 중...</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-content">
          <Link to="/main" className="logo" onClick={handleReset}>Novelog</Link>
          
          <Link to="/recommendations" className="reco-btn-header">
            내 취향의 책 추천받기
          </Link>

          <div className="user-section">
            <div className="user-info">
              <img src={user.picture} alt="프로필" className="user-avatar" />
              <span className="user-name">{user.name}</span>
            </div>
            <button className="reset-btn" onClick={handleResetSurvey}>
              설문 초기화
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="search-section">
          <h2>책 검색</h2>
          <div className="search-container">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요"
              onKeyUp={(e) => { if (e.key === 'Enter') handleSearch(); }}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              검색
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>검색 중...</p>
          </div>
        )}

        {/* 검색 결과 렌더링 로직을 Naver API 구조에 맞게 수정 */}
        <div className="book-list">
          {books.map((book) => (
            <div key={book.isbn} className="book-item">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <h3 className="book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                <p className="book-author"><strong>저자:</strong> {book.author}</p>
                <p className="book-publisher"><strong>출판사:</strong> {book.publisher}</p>
                {book.description && (
                  <p className="book-description" dangerouslySetInnerHTML={{ __html: book.description }}></p>
                )}
                {book.link && (
                  <a 
                    href={book.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    네이버 도서에서 보기
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
