import React, {useState} from 'react'
const Blog = ({ blog }) => {
  const [expended, expend] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const unExpendedBlog = () => (
    <div>
      
    </div>
  );
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
    </div>
  )
}

export default Blog
