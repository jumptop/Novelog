import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. 기본 사용자 정보 가져오기
        const userResponse = await fetch('http://localhost:8080/api/user/me', { credentials: 'include' });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // 2. 설문 답변 가져오기
          const answersResponse = await fetch('http://localhost:8080/api/user/survey-answers', { credentials: 'include' });
          if (answersResponse.ok) {
            const answersData = await answersResponse.json();
            setSurveyAnswers(answersData);
          } else {
            console.error('설문 답변을 가져오는 데 실패했습니다.');
          }
        } else {
          console.error('사용자 기본 정보를 가져오는 데 실패했습니다.');
          // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('프로필 데이터 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  // 장르와 인생 책을 구분하여 표시
  const genres = surveyAnswers.filter(a => a.category === 'GENRE').map(a => a.content);
  const favoriteBook = surveyAnswers.find(a => a.category === 'FAVORITE_BOOK')?.content;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.picture} alt={user.name} className="profile-avatar" />
        <h1>{user.name}님의 프로필</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-details">
        <h2>나의 취향</h2>
        <div className="profile-section">
          <h3>선호 장르</h3>
          {genres.length > 0 ? (
            <p>{genres.join(', ')}</p>
          ) : (
            <p>선택된 장르가 없습니다.</p>
          )}
        </div>

        <div className="profile-section">
          <h3>최근 감명 깊게 읽은 책</h3>
          <p>{favoriteBook || '아직 입력된 책이 없습니다.'}</p>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/survey" className="change-prefs-btn">
          취향 바꾸기 (설문 다시하기)
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
