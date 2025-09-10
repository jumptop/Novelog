import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("로딩중");

  useEffect(() => {
    // springboot 서버에 요청을 보냄
    fetch('http://localhost:8080/api/hello') // 해당 url로 요청을 보냄
      .then(response => response.text()) // 응답을 텍스트로 변환
      .then(data => setMessage(data)) // 받은 데이터로 message 상태 업데이트
      .catch(error => {
        console.error("API 호출 중 연결 오류 발생 : ", error);
        setMessage("서버에 연결할 수 없습니다.")
      });
  }, []); // []를 사용하여 서버가 실행될 때 한번만 실행

  return (
    <>
      <h1>React + Spring Boot 연동 테스트</h1>
      <p>서버로부터 받은 메시지 : {message}</p>
    </>
  );
}

export default App
