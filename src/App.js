import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post/Post';
import { db, auth } from './firebase';
import {
  Modal,
  Button,
  Backdrop,
  Fade,
  makeStyles,
  Input,
  Avatar,
} from '@material-ui/core';
import ImageUpload from './components/ImageUpload/ImageUpload';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  console.log(user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const handleSignup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        auth
          .currentUser.updateProfile({
            displayName: username,
          })
          .then(() => {
            setUser(res.user);
            window.location.replace('/');
          });
      })
      .catch((err) => {
        alert(err.message);
      });
    setUsername('');
    setEmail('');
    setPassword('');
    setOpen(false);
    
  };

  const handleLogin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => setUser(res.user))
      .catch((err) => alert(err.message));

    setEmail('');
    setPassword('');
    setOpenLogin(false);
  };

  return (
    <div className="App">
      <div className="app_header">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="app_header_image">
            <a href="/">
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram"
              />
            </a>
          </div>
          <div className="button">
            {user !== null ? (
              <Button type="button" onClick={() => auth.signOut()}>
                Logout
              </Button>
            ) : (
              <div>
                <Button type="button" onClick={handleOpenLogin}>
                  Login
                </Button>
                <Button type="button" onClick={handleOpen}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="upload_section">
        {user && <ImageUpload username={user.displayName} />}
      </div>

      <div className="container hole_post">
        <div className="post_section">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              imageURL={post.imageURL}
              caption={post.caption}
            ></Post>
          ))}
        </div>

        <div className="profile">
          {user ? (
            <div className="profile_container">
              <div className="profile_avatar">
                <Avatar
                  className="post_avatar"
                  alt={user && user.displayName}
                  src="/static/images/avatar/1.jpg"
                />
              </div>
              <p>{user && user.displayName}</p>
              <p>{user && user.email}</p>
            </div>
          ) : (
            <div>
              <div className="profile_avatar">
                <Avatar
                  className="post_avatar"
                  alt={username}
                  src="/static/images/avatar/1.jpg"
                />
              </div>
              <h5 className="text-center mt-5">Please Login</h5>
            </div>
          )}
        </div>
      </div>

      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div style={{ marginBottom: '20px' }} className="text-center">
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram"
              />
            </div>
            <div>
              <form className="input-container">
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={!username}
                    onClick={handleSignup}
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
      <Modal
        className={classes.modal}
        open={openLogin}
        onClose={handleCloseLogin}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openLogin}>
          <div className={classes.paper}>
            <div style={{ marginBottom: '20px' }} className="text-center">
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="Instagram"
              />
            </div>
            <div>
              <form className="input-container">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <div className="text-center">
                  <Button type="submit" onClick={handleLogin}>
                    Login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default App;
