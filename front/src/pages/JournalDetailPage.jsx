import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './JournalDetailPage.css';

const JournalDetailPage = () => {
    const { id } = useParams(); // URL에서 ID 가져오기
    const navigate = useNavigate();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJournalDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/journals/${id}`, {
                    credentials: 'include'
                });

                if (response.status === 401) {
                    navigate('/login'); // 로그인 필요
                    return;
                }
                if (response.status === 403 || response.status === 404) {
                    setError('해당 독서 기록을 찾을 수 없거나 접근 권한이 없습니다.');
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setJournal(data);
            } catch (err) {
                console.error('독서 기록 상세 정보를 가져오는 중 오류 발생:', err);
                setError('독서 기록을 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJournalDetail();
        }
    }, [id, navigate]);

    if (loading) {
        return <div className="journal-detail-loading">기록을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="journal-detail-error">오류: {error}</div>;
    }

    if (!journal) {
        return <div className="journal-detail-error">기록을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="journal-detail-page-container">
            <Link to="/journals" className="back-to-list-btn">
                &larr; 목록으로 돌아가기
            </Link>
            <div className="journal-detail-card">
                <header className="journal-detail-header">
                    <img src={journal.bookImage} alt={journal.bookTitle} className="journal-detail-book-image" />
                    <h1 className="journal-detail-book-title" dangerouslySetInnerHTML={{ __html: journal.bookTitle }}></h1>
                    <p className="journal-detail-date">작성일: {new Date(journal.createdAt).toLocaleDateString()}</p>
                </header>

                <main className="journal-detail-content">
                    <section className="journal-detail-section">
                        <h2>나의 감상평</h2>
                        <p className="journal-detail-user-notes">{journal.userNotes}</p>
                    </section>

                    <section className="journal-detail-section">
                        <h2>Gemini의 독서 기록</h2>
                        <p className="journal-detail-ai-text">{journal.aiJournal}</p>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default JournalDetailPage;
