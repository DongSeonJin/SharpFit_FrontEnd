import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserInfo = () => {
  const userId = 1; // 임시로 설정한 userId 변수 -> 추후 수정해야 함
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버로부터 사용자 데이터를 가져옵니다.
    axios
      .get(`/mypage/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEditProfile = () => {
    // 버튼 클릭 시 페이지 이동
    navigate("/mypage/edit");
  };

  // 인라인 스타일로 프로필 사진 스타일 설정
  const profilePictureStyle = {
    width: "200px",
    height: "200px",
    borderRadius: "50%", // 동그랗게 만들기
    objectFit: "cover", // 이미지가 공간을 채우도록 설정 (가로세로 비율 유지)
  };

  return (
    <div>
      <div>
        <img src={user.imageUrl} alt="프로필사진" style={profilePictureStyle} />
        <h1>{user.nickname}</h1>
        <button onClick={handleEditProfile}>회원정보 수정</button>
      </div>
      <div>
        <div>
          쿠폰 {user.point} 포인트 {user.point}
        </div>
        <div>
          <Link to="/orderhistory">주문내역</Link>
          <Link to="/shopping/wishlist">찜목록</Link>
          <Link to="/shopping/cart">장바구니</Link>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;