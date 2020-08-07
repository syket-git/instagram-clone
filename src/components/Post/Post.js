import React, { useState, useEffect } from 'react';
import './Post.css';
import { Avatar, Button } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { db } from '../../firebase';
import firebase from 'firebase';

const Post = ({ username, imageURL, caption, user, postId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [like, setLike] = useState(false);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comment: doc.data() }))
          );
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const addComment = (event) => {
    event.preventDefault();
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  const liked = (id) => {
    setLike(false);
  };
  const unLiked = () => {
    setLike(true);
  };

  return (
    <div>
      <div className="post">
        <div className="post_header">
          <Avatar
            className="post_avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
          />
          <h6 className="font-weight-bold">{username}</h6>
        </div>
        <div className="post_image">
          <img src={imageURL} alt="" />
        </div>
        <div className="post_caption">
          {like !== true ? (
            <FavoriteBorderIcon onClick={unLiked} className="red" />
          ) : (
            <FavoriteIcon onClick={liked} className="red" />
          )}

          <h6>
            <strong>{username} </strong>
            {caption}
          </h6>
        </div>
        <div className="comment_section">
          <div className="comments">
            {comments.map(({ id, comment }) => (
              <p key={id}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
            ))}
          </div>
          {user && (
            <div className="submit_comment">
              <form className="comment_form">
                <input
                  className="comment_input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  type="text"
                  placeholder="Add a comment..."
                />
                <Button
                  disabled={!comment}
                  type="submit"
                  size="small"
                  variant="outlined"
                  onClick={addComment}
                  color="primary"
                >
                  Add
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
