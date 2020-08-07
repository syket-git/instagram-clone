import React, { useState } from 'react';
import { Input, Button, Avatar } from '@material-ui/core';
import { db, storage } from '../../firebase';
import firebase from 'firebase';
import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [openProgress, setOpenProgress] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    setOpenProgress(true);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageURL: url,
              username: username,
            });
            setCaption('');
            setProgress(0);
            setOpenProgress(false);
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="container">
      <div className="upload_container upload">
        <div className="avatar_caption">
          <Avatar
            className="post_avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
          />
          <Input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your caption..."
          />
        </div>
        <div className="file_upload">
          <label for="file">Choose a picture</label>
          <input
            type="file"
            id="file"
            className="inputfile"
            onChange={handleChange}
          />
          <div>
            <Button
              disabled={!image}
              size="small"
              onClick={handleUpload}
              variant="outlined"
              color="primary"
            >
              Post
            </Button>
          </div>
        </div>
        {openProgress && (
          <progress className="progress" value={progress} max="100" />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
