import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터를 가져오기 위한 훅

// 상세 페이지를 위한 기본 CSS (필요에 따라 별도 CSS 파일로 분리 가능)
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
  const { isbn } = useParams(); // URL의 :isbn 부분을 가져옵니다.
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/books/${isbn}`);
        if (response.ok) {
          const bookData = await response.json();
          setBook(bookData);
        } else {
          console.error("책 정보를 가져오는 데 실패했습니다.");
          setBook(null); // 실패 시 book state를 null로 설정
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
  }, [isbn]); // isbn 값이 바뀔 때마다 API를 다시 호출

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={detailPageStyles}>
      <img src={book.image} alt={book.title} style={detailImageStyles} />
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
