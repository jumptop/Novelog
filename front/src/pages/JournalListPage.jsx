import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './JournalListPage.css';

const JournalListPage = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/journals', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    navigate('/login'); // 로그인 필요 시 로그인 페이지로 리다이렉트
                    return;
                }

                const data = await response.json();
                setJournals(data);
            } catch (error) {
                console.error('독서 기록을 가져오는 중 오류 발생:', error);
                navigate('/login'); // 오류 발생 시 로그인 페이지로 리다이렉트
            } finally {
                setLoading(false);
            }
        };

        fetchJournals();
    }, [navigate]);

    const handleDelete = async (e, journalId) => {
        e.preventDefault(); // 기본 동작(링크 이동) 방지
        e.stopPropagation(); // Link 컴포넌트의 페이지 이동 방지
        if (!confirm('정말로 이 독서 기록을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/journals/${journalId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('독서 기록이 삭제되었습니다.');
                setJournals(journals.filter(journal => journal.id !== journalId)); // 목록에서 제거
            } else if (response.status === 403) {
                alert('이 기록을 삭제할 권한이 없습니다.');
            } else {
                alert('독서 기록 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('독서 기록 삭제 중 오류:', error);
            alert('독서 기록 삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="journal-list-loading">독서 기록을 불러오는 중...</div>;
    }

    return (
        <div className="journal-list-page-container">
            <Link to="/main" className="back-to-main-btn">
                &larr; 메인으로 돌아가기
            </Link>
            <h1 className="journal-list-page-title">나의 독서 기록</h1>

            {journals.length > 0 ? (
                <div className="journal-grid">
                    {journals.map(journal => (
                        <Link to={`/journal/${journal.id}`} key={journal.id} className="journal-grid-item">
                            <img src={journal.bookImage} alt={journal.bookTitle} className="journal-grid-image" />
                            <h3 className="journal-grid-title" dangerouslySetInnerHTML={{ __html: journal.bookTitle }}></h3>
                            <button onClick={(e) => handleDelete(e, journal.id)} className="delete-journal-btn">-</button>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="no-journals-message">아직 작성된 독서 기록이 없습니다.</p>
            )}
        </div>
    );
};

export default JournalListPage;
