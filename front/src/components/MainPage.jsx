import React, { useEffect, useState } from 'react';
import './MainPage.css';

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 사용자 정보 확인
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
        setUser(userData);
      } else if (response.status === 401) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      } else {
        console.error('사용자 정보 조회 실패:', response.status);
        // 서버 오류의 경우 잠시 후 재시도
        setTimeout(() => {
          checkUserStatus();
        }, 2000);
      }
    } catch (error) {
      console.error('사용자 상태 확인 중 오류:', error);
      // 네트워크 오류의 경우 잠시 후 재시도
      setTimeout(() => {
        checkUserStatus();
      }, 2000);
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
          <h1 className="logo">Novelog</h1>
          <div className="user-section">
            <div className="user-info">
              <img src={user.picture} alt="프로필" className="user-avatar" />
              <span className="user-name">{user.name}</span>
            </div>
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

        <div className="book-list">
          {books.map((book, index) => (
            <div key={index} className="book-item">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <h3 className="book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                <p className="book-author"><strong>저자:</strong> {book.author}</p>
                <p className="book-publisher"><strong>출판사:</strong> {book.publisher}</p>
                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}
                {book.link && (
                  <a 
                    href={book.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    네이버 도서 정보 보기
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
