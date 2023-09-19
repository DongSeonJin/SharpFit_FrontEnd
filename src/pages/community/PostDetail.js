import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios 추가
import { useParams, useNavigate, Link } from 'react-router-dom'; // useParams와 useHistory 추가
import { Table, TableBody, TableCell, TableRow, Box } from '@material-ui/core';
import { Button } from '@material-ui/core'
import LikeButton from './../../components/community/LikeButton';
import ReplyList from './../../components/community/ReplyList';
import ReplyCreate from './../../components/community/ReplyCreate';
import { makeStyles } from '@material-ui/core/styles';
// import styles from '../../styles/community/PostDetail.module.css';

const useStyles = makeStyles({
  whiteText: {
    color: '#fff',
  },
  cellPadding: {
    paddingLeft: '0px',
  },
});

const PostDetail = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState({});
  const { postId } = useParams(); // postId를 URL 파라미터로 가져옴
  const [replies, setReplies] = useState([]);
  // const [likeCount, setLikeCount] = useState(0);
  // const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const classes = useStyles();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에서 게시글 정보를 가져오는 요청 보내기
        const [postResponse, repliesResponse] = await Promise.all ([
          axios.get(`/post/${postId}`),
          axios.get(`/reply/${postId}/all`),
        ]);
        
        setData({
          ...postResponse.data,
          imageUrls: [
            postResponse.data.imageUrl1, 
            postResponse.data.imageUrl2, 
            postResponse.data.imageUrl3
          ]});

          setReplies(repliesResponse.data);
          // setLikeCount(postResponse.data.likeCnt);
          // setIsLiked(LikeResponse.data === 1); // 백엔드에서 받은 값이 1이면 true(좋아요 함), 아니면 false(좋아요 안 함)
          
      } catch (error) {
        console.error('게시글 조회 실패 :', error);
      }
    };
    fetchData();
  }, [postId]);

  // const handleReplySubmit = newReply => {
  //   setReplies(prevReplies => [...prevReplies, newReply]);
  // };

  const handleNewReply = async () => {
    // 새로운 댓글이 등록될 때 호출되는 함수
    const responseReplies = await axios.get(`/reply/${postId}/all`);
    setReplies(responseReplies.data);
  }

  const handleDeletePost = async () => {
    // 사용자로부터 삭제 확인을 받기 위한 알림창 표시
    const shouldDelete = window.confirm('게시글을 삭제하시겠습니까?');
    if (shouldDelete) {
        try {
            await axios.delete(`/post/${postId}`);
            alert('게시글이 삭제되었습니다.');
            navigate('/community/post/list'); // 삭제 후 목록으로 돌아가기
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    }
};

  const handleDeleteReply = (replyId) => {
    // 댓글 삭제 로직을 구현하고, 삭제 후 업데이트된 댓글 목록을 설정
    axios.delete(`/reply/${replyId}`);
    const updatedReplies = replies.filter(reply => reply.replyId !== replyId);
    setReplies(updatedReplies);
  };  

  const handleUpdateReply = async (replyId, updatedReply) => {
    try {
        await axios.put(`/reply/${replyId}`, { content: updatedReply });
        const responseReplies = await axios.get(`/reply/${postId}/all`);
        setReplies(responseReplies.data);
    } catch (error) {
        console.error('댓글 수정 실패:', error);
        alert('댓글 수정에 실패했습니다.');
    }
  };


  return (
    <>
      <h2 align="center">게시글 상세정보</h2>

      <div className="post-view-wrapper" style={{ width: '80%', margin: '0 auto'}}>
        {data.postId ? (
          <>
            <Table>
              <TableBody>
                <TableRow >
                  <TableCell className={`${classes.whiteText}`} style={{ width: '110px'}}>게시글 번호</TableCell>
                  <TableCell className={`${classes.whiteText}`}>{data.postId}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>작성자</TableCell>
                  <TableCell className={classes.whiteText}>{data.nickname}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>작성일</TableCell>
                  <TableCell className={classes.whiteText}>{data.createdAt}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>조회수</TableCell>
                  <TableCell className={classes.whiteText}>{data.viewCount}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>카테고리</TableCell>
                  <TableCell className={classes.whiteText}>{data.category}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>제목</TableCell>
                  <TableCell className={classes.whiteText}> {data.title}</TableCell>
                </TableRow>
              </TableBody>

              <TableBody>
                <TableRow>
                  <TableCell className={classes.whiteText}>내용</TableCell>
                  <TableCell className={classes.whiteText}>{data.content}</TableCell>
                </TableRow>
              </TableBody>
              
            </Table>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

              {data.imageUrls.map((imageUrl, index) =>
                imageUrl && (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`첨부이미지${index + 1}`}
                    style={{ width: '500px', height: '500px', marginBottom: '20px', marginTop: '20px' }}
                  />
                )
              )}
            </div>
            <br /><br />

            <ReplyList 
                replies={replies} 
                onDeleteReply={handleDeleteReply}
                onUpdateReply={handleUpdateReply} />

            <ReplyCreate postId={postId} onReplySubmit={handleNewReply} />


            <Box display='flex' justifyContent='flex-end' mt={2}>
              <Box mt={1.7} mr={1.5}>
                <LikeButton postId={postId} /> {/*좋아요 버튼 component 분리, prop으로 postId 전달*/}
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/community/post/list/${data.categoryId}`)}
                style={{ marginTop: '10px' }}
              > 목록으로 돌아가기 </Button>

              {data.postId && (  // postId 가 존재할 때만 버튼 보이기
                <>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/community/post/update/${postId}`} // 수정 페이지 경로로 이동
                    style={{ marginTop: '10px', marginLeft: '10px' }}
                > 수정하기 </Button>

                <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      onClick={handleDeletePost}
                      style={{ marginTop: '10px', marginLeft: '10px' }}
                > 삭제하기 </Button> <br /> <br />
              </>
              )}
            </Box>
          
          </>
        ) : (
          '' // 해당 게시글을 찾을 수 없습니다.
        )}

      
        

        

    

      </div>
    </>
  );
};

export default PostDetail;
