import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 유저 정보와 설문 답변 정보를 동시에 요청
                const [userResponse, answersResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/user/me', { credentials: 'include' }),
                    fetch('http://localhost:8080/api/user/answers', { credentials: 'include' })
                ]);

                if (!userResponse.ok || !answersResponse.ok) {
                    // 둘 중 하나라도 실패하면 로그인 페이지로 이동
                    navigate('/login');
                    return;
                }

                const userData = await userResponse.json();
                const answersData = await answersResponse.json();

                setUser(userData);
                setAnswers(answersData);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleResetSurvey = async () => {
        if (!confirm('정말로 설문을 초기화하시겠습니까? 모든 추천 기록이 사라지며, 다시 로그인해야 합니다.')) {
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/user/me/reset-survey', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('설문이 초기화되었습니다. 다시 로그인해주세요.');
                // 로그아웃 처리
                await fetch('http://localhost:8080/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                navigate('/login');
            } else {
                const errorText = await response.text();
                alert(`초기화에 실패했습니다: ${errorText}`);
            }
        } catch (error) {
            console.error('설문 초기화 중 오류:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="profile-loading">데이터를 불러오는 중...</div>;
    }

    const preferredGenres = answers.filter(a => a.category === 'GENRE').map(a => a.content);
    const favoriteBook = answers.find(a => a.category === 'FAVORITE_BOOK');

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                <header className="profile-header">
                    <img src={user?.picture} alt="프로필 이미지" className="profile-picture" />
                    <h1 className="profile-name">{user?.name}</h1>
                    <p className="profile-email">{user?.email}</p>
                </header>

                <main className="profile-content">
                    <section className="profile-section">
                        <h2 className="section-title">나의 선호 장르</h2>
                        <div className="genres-container">
                            {preferredGenres.length > 0 ? (
                                preferredGenres.map((genre, index) => (
                                    <span key={index} className="genre-tag">#{genre}</span>
                                ))
                            ) : (
                                <p>선택한 장르가 없습니다.</p>
                            )}
                        </div>
                    </section>

                    <section className="profile-section">
                        <h2 className="section-title">나의 인생 책</h2>
                        <p className="favorite-book">
                            {favoriteBook ? favoriteBook.content : '입력한 책이 없습니다.'}
                        </p>
                    </section>
                </main>

                <footer className="profile-footer">
                    <button onClick={handleResetSurvey} className="reset-survey-btn">
                        설문 다시하기
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProfilePage;