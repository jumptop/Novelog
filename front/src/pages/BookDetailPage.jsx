import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// 간단한 스타일 객체
const detailPageStyles = {
  padding: '40px',
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  gap: '40px',
  alignItems: 'flex-start',
  color: '#213547' // 글자색을 어두운 색으로 명시적으로 지정
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
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/books/${id}`, {
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

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

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
        {/* description이 HTML 태그를 포함할 수 있으므로, dangerouslySetInnerHTML 사용 */}
        <p dangerouslySetInnerHTML={{ __html: volumeInfo.description }}></p>
        <a href={volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">
          Google Books에서 더 보기
        </a>
      </div>
    </div>
  );
};

export default BookDetailPage;