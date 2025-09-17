import React, { useState } from 'react';
import './JournalPage.css';
import { Link } from 'react-router-dom';

const JournalPage = () => {
    const [step, setStep] = useState(1); // 1: 책 검색, 2: 감상평 입력, 3: 결과 확인
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [userNotes, setUserNotes] = useState('');
    const [aiJournal, setAiJournal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) {
            alert('검색어를 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/search/books?query=${query}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.items || []);
            } else {
                alert('책 검색에 실패했습니다.');
            }
        } catch (error) {
            console.error('Search API error:', error);
            alert('책 검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBook = (book) => {
        setSelectedBook(book);
        setStep(2);
    };

    const handleGenerateJournal = async () => {
        if (!userNotes) {
            alert('간단한 감상평을 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            const requestDto = {
                bookTitle: selectedBook.title.replace(/<[^>]+>/g, ''), // HTML 태그 제거
                bookIsbn: selectedBook.isbn,
                bookImage: selectedBook.image,
                userNotes: userNotes,
            };

            const response = await fetch('http://localhost:8080/api/journals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(requestDto),
            });

            if (response.status === 201) {
                const data = await response.json();
                setAiJournal(data.aiJournal);
                setStep(3);
            } else {
                alert('독서 기록 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Journal API error:', error);
            alert('독서 기록 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setQuery('');
        setSearchResults([]);
        setSelectedBook(null);
        setUserNotes('');
        setAiJournal('');
    }

    return (
        <div className="journal-page-container">
            <Link to="/main" className="back-to-main-btn">
                &larr; 메인으로 돌아가기
            </Link>
            <div className="journal-card">
                <h1 className="journal-header">나의 독서 기록 생성</h1>

                {/* --- 1단계: 책 검색 --- */}
                {step === 1 && (
                    <div className="journal-step">
                        <h2>1. 어떤 책에 대한 기록인가요?</h2>
                        <div className="search-container">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="책 제목, 저자 등으로 검색"
                                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                                className="search-input"
                            />
                            <button onClick={handleSearch} disabled={loading} className="journal-btn">
                                {loading ? '검색 중...' : '검색'}
                            </button>
                        </div>
                        <div className="search-results">
                            {searchResults.map(book => (
                                <div key={book.isbn} className="result-item" onClick={() => handleSelectBook(book)}>
                                    <img src={book.image} alt={book.title} />
                                    <div className="result-info">
                                        <h3 dangerouslySetInnerHTML={{ __html: book.title }}></h3>
                                        <p>{book.author} | {book.publisher}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 2단계: 감상평 입력 --- */}
                {step === 2 && selectedBook && (
                    <div className="journal-step">
                        <h2>2. 책을 읽고 느낀 점을 알려주세요.</h2>
                        <div className="selected-book-info">
                            <img src={selectedBook.image} alt={selectedBook.title} />
                            <h3 dangerouslySetInnerHTML={{ __html: selectedBook.title }}></h3>
                        </div>
                        <textarea
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                            placeholder="'인생의 의미를 다시 생각하게 되었다.'와 같이 간단하게 적어주세요."
                            rows="4"
                            className="notes-textarea"
                        ></textarea>
                        <div className="button-group">
                            <button onClick={() => setStep(1)} className="journal-btn secondary-btn">책 다시 선택</button>
                            <button onClick={handleGenerateJournal} disabled={loading} className="journal-btn">
                                {loading ? '생성 중...' : 'AI 독서 기록 생성'}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- 3단계: 결과 확인 --- */}
                {step === 3 && (
                    <div className="journal-step">
                        <h2>3. Gemini가 작성한 독서 기록입니다.</h2>
                        <div className="selected-book-info">
                            <img src={selectedBook.image} alt={selectedBook.title} />
                            <h3 dangerouslySetInnerHTML={{ __html: selectedBook.title }}></h3>
                        </div>
                        <div className="ai-journal-result">
                            <p>{aiJournal}</p>
                        </div>
                        <div className="button-group">
                            <button onClick={handleReset} className="journal-btn">
                                새로운 기록 작성하기
                            </button>
                            <Link to="/main" className="journal-btn secondary-btn">
                                메인으로 돌아가기
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalPage;
