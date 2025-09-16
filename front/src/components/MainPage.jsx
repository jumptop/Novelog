import React, { useEffect, useState } from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';

// 검색 모달 컴포넌트
const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>책 검색</h2>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            onKeyUp={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="search-input"
            autoFocus
          />
          <button onClick={handleSearch} className="search-btn">검색</button>
        </div>
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}
        <div className="book-list modal-book-list">
          {books.map((book) => (
            <a key={book.isbn} href={book.link} target="_blank" rel="noopener noreferrer" className="book-item">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <h3 className="book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                <p className="book-author"><strong>저자:</strong> {book.author}</p>
                <p className="book-publisher"><strong>출판사:</strong> {book.publisher}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// 메인 페이지 컴포넌트
const MainPage = () => {
  const [user, setUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색 모달 상태
  const [newReleases, setNewReleases] = useState([]); // 신간 도서 상태 추가

  useEffect(() => {
    checkUserStatus();
    fetchNewReleases(); // 신간 도서 데이터 호출
  }, []);

  const fetchNewReleases = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/books/new-releases');
      if (response.ok) {
        const data = await response.json();
        setNewReleases(data.items || []);
      } else {
        console.error('신간 도서 정보 조회 실패:', response.status);
      }
    } catch (error) {
      console.error('신간 도서 정보 확인 중 오류:', error);
    }
  };

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

  const handleReset = () => {
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
          
          <div className="header-actions">
            {/* 검색 아이콘 버튼 */}
            <button className="action-btn" onClick={() => setIsSearchOpen(true)} title="검색">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <div className="user-section">
              <img src={user.picture} alt="프로필" className="user-avatar" />
              <Link to="/profile" className="info-btn">내 정보</Link>
              <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="centered-content">
          <div className="main-cta-container">
            <h1>당신만을 위한 소설 추천</h1>
            <p>간단한 취향 설문을 통해, AI가 새로운 인생 책을 찾아드립니다.</p>
            <Link to="/recommendations" className="main-reco-button">
              내 취향의 책 추천받기
            </Link>
          </div>
        </div>

        {/* 신간 도서 섹션 */}
        <div className="new-releases-section">
          <h2 className="new-releases-title">문학 그 너머로</h2>
          <div className="new-releases-grid">
            {newReleases.map(book => (
              <a key={book.isbn} href={book.link} target="_blank" rel="noopener noreferrer" className="new-releases-book-item">
                <img src={book.image} alt={book.title} className="new-releases-book-image" />
                <div className="new-releases-book-info">
                  <h3 className="new-releases-book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* 검색 모달 */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default MainPage;
