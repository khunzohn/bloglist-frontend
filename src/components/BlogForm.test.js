import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("<BlogFrom /> create new blog", () => {

    let component
    let createBlog

    beforeEach(() => {
        createBlog = jest.fn()
        component  = render(
            <BlogForm createBlog={createBlog} />
        )
    })

    test('event handler gets calles with the right details', () => {
        const form = component.container.querySelector('form')
        const author = component.container.querySelector('#author')
        const title = component.container.querySelector('#title')
        const url = component.container.querySelector('#url')

        fireEvent.change(author,{
            target: {value:'Khun Zohn'}
        })

        fireEvent.change(title,{
            target: {value:'Teach yourself meditation'}
        })

        fireEvent.change(url,{
            target: {value:'link to blog'}
        })

        fireEvent.submit(form)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0]).toEqual({
            author: 'Khun Zohn',
            title: 'Teach yourself meditation',
            url: 'link to blog'
        })
    })
});
