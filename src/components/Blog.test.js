import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let updateBlog
  let deleteBlog
  let component

  beforeEach(() => {
    const blog = {
      title: 'title',
      author: 'author',
      url: 'url',
      likes: 12,
      user: 'user',
    }

    updateBlog = jest.fn()

    deleteBlog = jest.fn()

    component = render(
      <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
    )
  })

  test('renders only title and author by default', () => {
    expect(component.getByText('title author')).toBeDefined()
    expect(component.container.querySelector('.divUrl')).toBe(null)
    expect(component.container.querySelector('.divLikes')).toBe(null)
  })

  test('when view button is clicked, url and likes are shown', () => {

    const button = component.container.querySelector('button')

    fireEvent.click(button)

    expect(component.container.querySelector('.divUrl')).toBeDefined()
    expect(component.container.querySelector('.divLikes')).toBeDefined()
  })

  test('when like button is clicked twice, event handler is also call twice', () => {
    const button = component.container.querySelector('button')

    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
