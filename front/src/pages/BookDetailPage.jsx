import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const detailPageStyles = {
  padding: '40px',
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
  color: '#213547'
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
  const { isbn } = useParams(); // URL 파라미터를 id에서 isbn으로 변경
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        // API 경로를 ISBN으로 조회하도록 수정
        const response = await fetch(`http://localhost:8080/api/books/${isbn}`, {
          credentials: 'include'
        });
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

    if (isbn) {
      fetchBookDetails();
    }
  }, [isbn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

  // Naver API 데이터 구조에 맞게 렌더링 로직 수정
  return (
    <div style={detailPageStyles}>
      <img src={book.image} alt={book.title} style={detailImageImageStyles} />
      <div style={detailInfoStyles}>
        <h1 dangerouslySetInnerHTML={{ __html: book.title }}></h1>
        <h2>{book.author}</h2>
        <p><strong>출판사:</strong> {book.publisher}</p>
        <p><strong>출간일:</strong> {book.pubdate}</p>
        <hr />
        <p dangerouslySetInnerHTML={{ __html: book.description }}></p>
        <a href={book.link} target="_blank" rel="noopener noreferrer">
          네이버 도서에서 더 보기
        </a>
      </div>
    </div>
  );
};

export default BookDetailPage;
