import React, { useState } from 'react';
import './SurveyPage.css';

const SurveyPage = () => {
  // 사용자가 선택한 장르를 담을 state 배열
  const [selectedGenres, setSelectedGenres] = useState([]);

  // 체크박스 선택이 변경될 때마다 실행되는 함수
  const handleCheckboxChange = (event) => {
    const {value, checked} = event.target;

    if (checked) {
      // 체크박스가 선택되면, state 배열에 장르를 추가
      setSelectedGenres(prev => [...prev, value]);
    } else {
      setSelectedGenres(prev => prev.filter(genre => genre != value));
    }
  };


  const handleSubmit = async () => {

    // 선택된 장르가 하나도 없으면 경고
    if (selectedGenres.length == 0) {
      alert("선호하는 장르를 하나 이상 선택해주세요.");
      return;
    }

    // 1. 백엔드에 설문 완료 API를 호출합니다.
    try {
      const response = await fetch('http://localhost:8080/api/survey/complete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genres : selectedGenres }),
      });

      if (response.ok) {
        // 2. 성공하면 메인 페이지로 이동합니다.
        alert('설문이 완료되었습니다. 메인 페이지로 이동합니다.');
        window.location.href = '/main';
      } else {
        // 3. 실패하면 에러 메시지를 보여줍니다.
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
        <h1>취향 설문조사</h1>
        <p>Novelog가 더 정확한 책을 추천해 드릴 수 있도록, 잠시 시간을 내어주세요.</p>
        
        <div className="survey-form">
          <div className="question-group">
            <h3>선호하는 장르를 선택해주세요. (다중 선택 가능)</h3>
            {/* 예시 질문입니다. 나중에 실제 데이터로 변경할 수 있습니다. */}
            <label><input type="checkbox" name="genre" value="fantasy" onChange={handleCheckboxChange} /> 판타지</label>
            <label><input type="checkbox" name="genre" value="romance" onChange={handleCheckboxChange}/> 로맨스</label>
            <label><input type="checkbox" name="genre" value="scifi" onChange={handleCheckboxChange}/> SF</label>
            <label><input type="checkbox" name="genre" value="mystery" onChange={handleCheckboxChange}/> 미스터리/스릴러</label>
            <label><input type="checkbox" name="genre" value="history" onChange={handleCheckboxChange}/> 시대극/역사</label>
          </div>
          
          {/* 여기에 다른 질문들을 추가할 수 있습니다. */}

        </div>

        <button className="submit-btn" onClick={handleSubmit}>제출하고 시작하기</button>
      </div>
    </div>
  );
};

export default SurveyPage;
