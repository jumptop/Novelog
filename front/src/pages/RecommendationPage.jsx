import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationPage.css';

const BookPodiumCard = ({ book, rank }) => {
  if (!book) return null;
  return (
    <a href={book.link} target="_blank" rel="noopener noreferrer" className={`podium-card ${rank}`}>
      <div className="podium-rank-indicator">{rank === 'gold' ? '🥇' : rank === 'silver' ? '🥈' : '🥉'}</div>
      <img src={book.image} alt={book.title} className="podium-book-image" />
      <div className="podium-book-info">
        <h3 className="podium-book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
        <p className="podium-book-author">{book.author}</p>
        <p className="podium-book-publisher">{book.publisher}</p>
      </div>
    </a>
  );
};

const RecommendationPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/recommendations', {
          credentials: 'include',
        });
        if (response.ok) {
          const recoBooks = await response.json();
          setRecommendations(recoBooks);
        } else {
          alert('추천 목록을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error("추천 API 호출 중 오류:", error);
        alert('추천 목록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const goldMedalBook = recommendations.length > 0 ? recommendations[0] : null;
  const silverMedalBook = recommendations.length > 1 ? recommendations[1] : null;
  const bronzeMedalBook = recommendations.length > 2 ? recommendations[2] : null;
  const otherRecommendations = recommendations.length > 3 ? recommendations.slice(3) : [];

  return (
    <div className="reco-page-container">
      <Link to="/main" className="back-to-main-btn">
        &larr; 메인으로 돌아가기
      </Link>

      <div className="reco-header">
        <h1>Gemini의 도서 추천</h1>
        <p>당신의 설문 결과를 바탕으로 Gemini가 추천하는 책들입니다.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Gemini가 추천 중...</p>
        </div>
      ) : (
        <>
          <div className="podium-container">
            <BookPodiumCard book={goldMedalBook} rank="gold" />
            <BookPodiumCard book={silverMedalBook} rank="silver" />
            <BookPodiumCard book={bronzeMedalBook} rank="bronze" />
          </div>

          {otherRecommendations.length > 0 && (
            <>
              <hr className="reco-divider" />
              <div className="other-reco-section">
                <h2>이 책들도 소개합니다</h2>
                <div className="book-list">
                  {otherRecommendations.map((book) => (
                    <a key={book.isbn} href={book.link} target="_blank" rel="noopener noreferrer" className="book-item">
                      <img src={book.image} alt={book.title} className="book-image" />
                      <div className="book-info">
                        <h3 className="book-title" dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                        <p className="book-author"><strong>저자:</strong> {book.author}</p>
                        <p className="book-publisher"><strong>출판사:</strong> {book.publisher}</p>
                        {book.description && (
                          <p className="book-description" dangerouslySetInnerHTML={{ __html: book.description }}></p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendationPage;
