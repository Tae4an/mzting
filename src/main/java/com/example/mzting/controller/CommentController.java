package com.example.mzting.controller;

import com.example.mzting.dto.CommentDTO;
import com.example.mzting.entity.Comment;
import com.example.mzting.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 댓글 관련 요청을 처리하는 컨트롤러 클래스
 * 댓글 생성 및 조회와 관련된 API 엔드포인트를 정의
 */
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    // 로거 객체
    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);
    // 댓글 서비스
    private final CommentService commentService;

    /**
     * CommentController 생성자
     * 필요한 의존성을 주입받아 초기화
     *
     * @param commentService 댓글 서비스
     */
    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * 댓글을 생성하는 엔드포인트
     * 주어진 요청 객체를 바탕으로 댓글을 생성하고 결과를 반환
     *
     * @param profileId 인물 ID
     * @param PostPostsCommentRequest 댓글 생성 요청 객체
     * @return 댓글 생성 결과를 포함한 ResponseEntity 객체
     */
    @PostMapping("/{profileId}/create")
    public ResponseEntity<CommentDTO.PostPostsCommentsResponse> createComment(
            @PathVariable Long profileId,
            @RequestBody CommentDTO.PostPostsCommentsRequest PostPostsCommentRequest, HttpServletRequest request) {
        Long uid = (Long) request.getAttribute("uid");

        try {
            Comment comment = new Comment();
            comment.setUserId(uid);
            comment.setProfileId(profileId);
            comment.setContent(PostPostsCommentRequest.getContent());
            comment.setIsLike(PostPostsCommentRequest.getIsLike());
            comment.setLikeCount(0L);
            comment.setDislikeCount(0L);
            commentService.saveComment(comment);

            CommentDTO.PostPostsCommentsResponse response = new CommentDTO.PostPostsCommentsResponse();
            response.setSuccess(true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error creating comment: ", e);
            CommentDTO.PostPostsCommentsResponse response = new CommentDTO.PostPostsCommentsResponse();
            response.setSuccess(false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 특정 게시물의 댓글을 조회하는 엔드포인트
     *
     * @param profileId 인물 ID
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 20)
     * @return 댓글 목록을 포함한 ResponseEntity 객체
     */
    @GetMapping("/{profileId}/list")
    public ResponseEntity<CommentDTO.GetPostsCommentsResponse> getCommentsByProfileId(
            @PathVariable Long profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "All") String filter)
    {
        CommentDTO.GetPostsCommentsResponse response = commentService.getCommentInfoByProfileId(profileId, filter, PageRequest.of(page, size));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{commentId}/like")
    public int likeComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO.CommentLikeIncDecRequest commentLikeIncDecRequest,
            HttpServletRequest request) {
        if(commentLikeIncDecRequest.getIsFirst()) {
            return commentService.increaseLikeCountByCommentId(commentId);
        } else {
            return commentService.decreaseLikeCountByCommentId(commentId);
        }
    }

    @PostMapping("/{commentId}/dislike")
    public int dislikeComment(
            @PathVariable Long commentId,
            @RequestBody CommentDTO.CommentLikeIncDecRequest commentLikeIncDecRequest,
            HttpServletRequest request) {
        if(commentLikeIncDecRequest.getIsFirst()) {
            return commentService.increaseDisLikeCountByCommentId(commentId);
        } else {
            return commentService.decreaseDisLikeCountByCommentId(commentId);
        }
    }
}
