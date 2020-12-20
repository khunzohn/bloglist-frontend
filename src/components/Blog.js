import React, { useState } from 'react'
const Blog = ({ deleteBlog, updateBlog, blog }) => {
  const [expended, expend] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleState = () => {
    expend(!expended)
  }

  const unExpendedBlog = () => (
    <div style={blogStyle} className="unexpended">
      {blog.title} {blog.author} <button onClick={toggleState}>view</button>
    </div>
  )

  const handleLike = () => {
    const updatingBlog = {
      user: blog.user.id,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
    }
    updateBlog(blog.id, updatingBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const expendedBlog = () => (
    <div style={blogStyle} className="expended">
      <div>{blog.title} <button onClick={toggleState}>hide</button></div>
      <div className="divUrl">{blog.url} </div>
      <div className="divLikes">Likes {blog.likes} <button onClick={handleLike}>like</button></div>
      <div>{blog.author}</div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )

  return (
    <div>
      {expended ? expendedBlog() : unExpendedBlog()}
    </div>
  )
}

export default Blog
