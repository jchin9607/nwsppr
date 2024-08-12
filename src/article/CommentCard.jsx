import React, { useMemo } from 'react';
import ArticleAuthor from '../article/ArticleAuthor';

const CommentCard = ({ comment }) => {
  const memoizedCommentCard = useMemo(() => {
    return (
      <div>
        <ArticleAuthor useruid={comment.author} inComment={comment.comment} />
      </div>
    );
  }, [comment]);

  return memoizedCommentCard;
};

export default CommentCard;