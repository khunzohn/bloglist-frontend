import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const blogFormRef = useRef();

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

  const updateBlog = async (id, blog) => {
    try {
      const updatedBlog = await blogService.update(id, blog, user.token);

      console.log("updated blog", updatedBlog);
      if (updatedBlog) {
        getAllBlogs();
      }
    } catch (error) {
      console.log("update blog error", error);
      showNotification({
        message: "Failed to update blog",
        error: true,
      });
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id, user.token);

      console.log("blog deleted");
      getAllBlogs();
    } catch (error) {
      console.log("delete blog error", error);
      showNotification({
        message: "Failed to delete blog",
        error: true,
      });
    }
  };

  const createBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog, user.token);

      console.log("created blog", createdBlog);
      if (createdBlog) {
        getAllBlogs();

        showNotification({
          message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
          error: false,
        });
        blogFormRef.current.toggleLoginVisible();
      }
    } catch (error) {
      console.log("create blog error", error);
      showNotification({
        message: "Failed to create new blog",
        error: true,
      });
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
        error: true,
      });
    }
  };

  const showNotification = (notification) => {
    setMessage(notification);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
  };

  const loginForm = () => (
    <div>
      <Notification notification={message} />
      <form onSubmit={handleLogin}>
        <h1>Log in to application</h1>
        <div>
          username
          <input
            id="username"
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
            id="password"
            type="password"
            onChange={({ target }) => {
              setPassword(target.value);
            }}
            name="Password"
            value={password}
          />
        </div>
        <button id="submit" type="submit">
          submit
        </button>
      </form>
    </div>
  );

  const blogList = () => (
    <div>
      <Notification notification={message} />
      <h2>blogs</h2>

      <div>
        {user.username} logged in.{" "}
        <button onClick={handleLogout}>logout</button>
      </div>

      <div>
        <Togglable cta="new blog" ref={blogFormRef}>
          <h2>Create new</h2>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      </div>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
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
