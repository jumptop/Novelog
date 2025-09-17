import React, { useState } from 'react';
import './SurveyPage.css';

// 1페이지: 장르 선택 컴포넌트
const SurveyPage1_Genres = ({ answers, onAnswerChange }) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentGenres = answers.genres || [];
    let newGenres;
    if (checked) {
      newGenres = [...currentGenres, value];
    } else {
      newGenres = currentGenres.filter(genre => genre !== value);
    }
    onAnswerChange({ ...answers, genres: newGenres });
  };

  return (
    <div className="question-group">
      <h3>선호하는 장르를 선택해주세요. (다중 선택 가능)</h3>
      <label><input type="checkbox" value="판타지" onChange={handleCheckboxChange} checked={answers.genres?.includes('판타지')} /> 판타지</label>
      <label><input type="checkbox" value="로맨스" onChange={handleCheckboxChange} checked={answers.genres?.includes('로맨스')} /> 로맨스</label>
      <label><input type="checkbox" value="SF" onChange={handleCheckboxChange} checked={answers.genres?.includes('SF')} /> SF</label>
      <label><input type="checkbox" value="미스터리" onChange={handleCheckboxChange} checked={answers.genres?.includes('미스터리')} /> 미스터리/스릴러</label>
      <label><input type="checkbox" value="역사" onChange={handleCheckboxChange} checked={answers.genres?.includes('역사')} /> 시대극/역사</label>
      <label><input type="checkbox" value="무협" onChange={handleCheckboxChange} checked={answers.genres?.includes('무협')} /> 무협</label>
      <label><input type="checkbox" value="청소년소설" onChange={handleCheckboxChange} checked={answers.genres?.includes('청소년소설')} /> 청소년소설</label>
    </div>
  );
};

// 2페이지: 인생 책 입력 컴포넌트
const SurveyPage2_FavoriteBook = ({ answers, onAnswerChange }) => {
  const handleInputChange = (event) => {
    onAnswerChange({ ...answers, favoriteBook: event.target.value });
  };

  return (
    <div className="question-group">
      <h3>최근에 감명깊게 읽은 소설/책이 있다면?</h3>
      <p>추천의 정확도를 높이는 데 큰 도움이 됩니다.</p>
      <input 
        type="text" 
        className="favorite-book-input"
        placeholder="책 제목을 입력하세요 (선택 사항)"
        value={answers.favoriteBook || ''}
        onChange={handleInputChange}
      />
    </div>
  );
};


// 메인 설문 페이지 (페이지 관리자)
const SurveyPage = () => {
  const [page, setPage] = useState(1);
  const [answers, setAnswers] = useState({ genres: [], favoriteBook: '' });

  const handleSubmit = async () => {
    if (answers.genres.length === 0) {
      alert('선호하는 장르를 하나 이상 선택해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/survey/complete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });

      if (response.ok) {
        alert('설문이 완료되었습니다. 메인 페이지로 이동합니다.');
        window.location.href = '/main';
      } else {
        const errorText = await response.text();
        alert(`설문 제출에 실패했습니다: ${errorText}`);
      }
    } catch (error) {
      console.error('설문 제출 중 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-card">
        <h1>취향 설문조사 ({page}/2)</h1>
        
        <div className="survey-form">
          {page === 1 && <SurveyPage1_Genres answers={answers} onAnswerChange={setAnswers} />}
          {page === 2 && <SurveyPage2_FavoriteBook answers={answers} onAnswerChange={setAnswers} />}
        </div>

        <div className="survey-navigation">
          {page > 1 && <button className="nav-btn prev" onClick={() => setPage(page - 1)}>이전</button>}
          {page < 2 && <button className="nav-btn next" onClick={() => setPage(page + 1)}>다음</button>}
          {page === 2 && <button className="submit-btn" onClick={handleSubmit}>제출하고 시작하기</button>}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;