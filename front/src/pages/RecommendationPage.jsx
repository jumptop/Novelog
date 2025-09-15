import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationPage.css';

// BookPodiumCard 컴포넌트를 Google Books API 구조에 맞게 수정
const BookPodiumCard = ({ book, rank }) => {
  if (!book) return null;
  const { id, volumeInfo } = book;

  return (
    <Link to={`/book/${id}`} className={`podium-card ${rank}`}>
      <div className="podium-rank-indicator">{rank === 'gold' ? '🥇' : rank === 'silver' ? '🥈' : '🥉'}</div>
      <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} className="podium-book-image" />
      <div className="podium-book-info">
        <h3 className="podium-book-title">{volumeInfo.title}</h3>
        <p className="podium-book-author">{volumeInfo.authors?.join(', ')}</p>
        <p className="podium-book-publisher">{volumeInfo.publisher}</p>
      </div>
    </Link>
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

  return (
    <div className="reco-page-container">
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
        <div className="podium-container">
          <BookPodiumCard book={goldMedalBook} rank="gold" />
          <BookPodiumCard book={silverMedalBook} rank="silver" />
          <BookPodiumCard book={bronzeMedalBook} rank="bronze" />
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
