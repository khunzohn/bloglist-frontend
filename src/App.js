import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification"

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    getAllBlogs();
  }, []);

  const getAllBlogs = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  useEffect(() => {
    const cachedUserJson = window.localStorage.getItem("user");
    if (cachedUserJson) {
      setUser(JSON.parse(cachedUserJson));
    }
  }, []);

  const createBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(
        {
          url: url,
          title: title,
          author: author,
        },
        user.token
      );

      console.log("created blog", createBlog);
      if (createdBlog) {
        getAllBlogs();
        setTitle('')
        setUrl('')
        setAuthor('')

        showNotification({
          message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
          error: false
        })
      }
    } catch (error) {
      console.log("create blog error", error);
      showNotification({
        message: "Failed to create new blog",
        error: true
      })
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });

      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setPassword("");
      setUsername("");
    } catch (error) {
      console.log("login error", error);
      showNotification({
        message: "Wrong credentials",
        error: true
      })
    }
  };

  const showNotification = (notification) => {
    setMessage(notification);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>Log in to application</h1>

      <Notification notification={message}/>

      <div>
        username
        <input
          type="text"
          onChange={({ target }) => {
            setUsername(target.value);
          }}
          value={username}
          name="Username"
        />
      </div>

      <div>
        password
        <input
          type="password"
          onChange={({ target }) => {
            setPassword(target.value);
          }}
          name="Password"
          value={password}
        />
      </div>
      <button type="submit">submit</button>
    </form>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>

      <Notification notification={message}/>

      <div>
        {user.username} logged in.{" "}
        <button onClick={handleLogout}>logout</button>
      </div>

      <div>
        <h2>Create new</h2>
        <form onSubmit={createBlog}>
          <div>
            title:
            <input
              value={title}
              onChange={({ target }) => {
                setTitle(target.value);
              }}
              name="Title"
            />
          </div>
          <div>
            author:
            <input
              value={author}
              onChange={({ target }) => {
                setAuthor(target.value);
              }}
              name="Author"
            />
          </div>

          <div>
            url:
            <input
              value={url}
              onChange={({ target }) => {
                setUrl(target.value);
              }}
              name="Title"
            />
          </div>

          <button type="submit">create</button>
        </form>
      </div>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return (
    <div>
      {user === null && loginForm()}
      {user !== null && blogList()}
    </div>
  );
};

export default App;
