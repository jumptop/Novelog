import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // 사용자가 입력하는 검색어를 관리하는 state
  const [query, setQuery] = useState('');
  // API로부터 받은 책 목록을 관리하는 state
  const [books, setBooks] = useState([]);
  // 로딩 중인지 여부를 관리하는 state
  const [loading, setLoading] = useState(false);

  // 검색 버튼을 눌렀을 때 실행될 함수
  const handleSearch = () => {
    if (!query) {
      alert('검색어를 입력해주세요.');
      return;
    }
    setLoading(true); // 로딩 시작
    setBooks([]); // 이전 검색 결과 초기화

    // 백엔드 API 호출
    fetch(`http://localhost:8080/api/search/books?query=${query}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data.items || []); // API 응답에서 items 배열을 books state에 저장
        setLoading(false); // 로딩 종료
      })
      .catch(error => {
        console.error("API 호출 중 오류 발생:", error);
        alert('책 정보를 가져오는 데 실패했습니다.');
        setLoading(false); // 로딩 종료
      });
  };

  return (
    <div className="App">
      <h1>책 검색</h1>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          onKeyUp={(e) => { if (e.key === 'Enter') handleSearch(); }} // 엔터 키로도 검색
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {loading && <p>로딩 중...</p>}

      <div className="book-list">
        {books.map((book, index) => (
          <div key={index} className="book-item">
            <img src={book.image} alt={book.title} />
            <div className="book-info">
              <h2 dangerouslySetInnerHTML={{ __html: book.title }}></h2>
              <p><strong>저자:</strong> {book.author}</p>
              <p><strong>출판사:</strong> {book.publisher}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App