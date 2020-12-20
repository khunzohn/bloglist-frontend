import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value)
            }}
            name="Title"
          />
        </div>
        <div>
          author:
          <input
            id="author"
            value={author}
            onChange={({ target }) => {
              setAuthor(target.value)
            }}
            name="Author"
          />
        </div>

        <div>
          url:
          <input
            id="url"
            value={url}
            onChange={({ target }) => {
              setUrl(target.value)
            }}
            name="Title"
          />
        </div>

        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
