import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const UserInfoUpdate = () => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const userId = 1; // 임시로 설정한 userId 변수 -> 추후 수정해야 함
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(true); // 닉네임 중복 여부 상태

  // 서버로 보낼 데이터
  const userUpdateData = {
    userId: userId,
    nickname: nickname,
    imageUrl: profileImage ? profileImage : null,
  };

  useEffect(() => {
    // 서버로부터 사용자 데이터를 가져옵니다.
    axios
      .get(`/mypage/${userId}`)
      .then((response) => {
        setUser(response.data);
        setNickname(response.data.nickname);
        // 프로필 이미지 url이 있다면 이미지 로드
        if (response.data.imageUrl) {
          setProfileImage(response.data.imageUrl);
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  }, [userId]);

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      // 파일 선택 시 POST 요청
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/api/imageOptimizer/3", formData)
        .then((response) => {
          console.log("파일 업로드 성공", response.data);
          setProfileImage(response.data);
        })
        .catch((error) => {
          console.error("파일 업로드 실패", error);
        });
    }
  };

  // '회원정보 수정' 버튼 클릭 핸들러
  const handleUpdateProfile = () => {
    // 닉네임 중복 여부 확인
    axios
      .post(`/checkNickname`, { nickname: nickname }, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        if (response.data) {
          // 닉네임 사용 가능한 경우
          setIsNicknameAvailable(true);
          // 서버로 patch 요청 보내기
          axios
            .patch(`/mypage/${userId}`, userUpdateData)
            .then((response) => {
              console.log("프로필 업데이트 성공:", response.data);
              // 프로필 업데이트 성공 후 리다이렉트
              navigate("/mypage/info");
            })
            .catch((error) => {
              console.error("프로필 업데이트 실패:", error);
              // 프로필 업데이트 실패 시 오류 처리 또는 다른 작업 수행
            });
        } else {
          // 만약 닉네임이 현재 사용자의 닉네임과 동일하다면 중복으로 처리하지 않음
          if (nickname === user.nickname) {
            setIsNicknameAvailable(true); // 중복이 아니라고 설정
            axios
              .patch(`/mypage/${userId}`, userUpdateData)
              .then((response) => {
                console.log("프로필 업데이트 성공:", response.data);
                // 프로필 업데이트 성공 후 리다이렉트
                navigate("/mypage/info");
              })
              .catch((error) => {
                console.error("프로필 업데이트 실패:", error);
                // 프로필 업데이트 실패 시 오류 처리 또는 다른 작업 수행
              });
          } else {
            // 닉네임 중복인 경우
            setIsNicknameAvailable(false);
            alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
          }
        }
      })
      .catch((error) => {
        console.error("에러:", error);
      });
  };

  const handleChangePassword = () => {
    // 비밀번호 변경 페이지로 이동
    navigate("/edit/password");
  };

  return (
    <div>
      <div>다른 유저와 겹치지 않도록 입력해 주세요</div>
      <div>
        <label>닉네임</label>
        <input type="text" value={nickname} onChange={handleNicknameChange} placeholder="닉네임" />
      </div>
      {!isNicknameAvailable && (
        <div style={{ color: "red" }}>이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.</div>
      )}
      <div>
        <label>프로필이미지</label>
        <div>
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile Preview"
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
            />
          ) : (
            <div style={{ width: "200px", height: "200px", backgroundColor: "lightgray", borderRadius: "50%" }}></div>
          )}
          <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
        </div>
      </div>
      <button onClick={handleUpdateProfile}>회원정보 수정</button>
      <button>탈퇴하기</button>
      <button onClick={handleChangePassword}>비밀번호 변경하기</button>
    </div>
  );
};

export default UserInfoUpdate;