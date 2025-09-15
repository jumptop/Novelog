import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// 간단한 스타일 객체
const detailPageStyles = {
  padding: '40px',
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start'
};

const detailImageStyles = {
  width: '300px',
  height: '450px',
  objectFit: 'cover',
  borderRadius: '12px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
};

const detailInfoStyles = {
  flex: 1
};

const BookDetailPage = () => {
  const { id } = useParams(); // URL의 :id 부분을 가져옵니다.
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        // API 경로를 Google Books ID로 조회하도록 수정
        const response = await fetch(`http://localhost:8080/api/books/${id}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else {
          console.error("책 정보를 가져오는 데 실패했습니다.");
          setBook(null);
        }
      } catch (error) {
        console.error("API 호출 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]); // id 값이 바뀔 때마다 API를 다시 호출

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

  // Google Books API 데이터 구조에 맞게 렌더링 로직 수정
  const { volumeInfo } = book;

  return (
    <div style={detailPageStyles}>
      <img src={volumeInfo.imageLinks?.thumbnail} alt={volumeInfo.title} style={detailImageStyles} />
      <div style={detailInfoStyles}>
        <h1>{volumeInfo.title}</h1>
        <h2>{volumeInfo.authors?.join(', ')}</h2>
        <p><strong>출판사:</strong> {volumeInfo.publisher}</p>
        <p><strong>출간일:</strong> {volumeInfo.publishedDate}</p>
        <hr />
        <p>{volumeInfo.description}</p>
        <a href={volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">
          Google Books에서 더 보기
        </a>
      </div>
    </div>
  );
};

export default BookDetailPage;