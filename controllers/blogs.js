const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  
	const savedBlog = await blog.save()
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const blog = request.body

	const newInfo = {
		title: blog.title,
		author: blog.author,
		url: blog.url,
		likes: blog.likes + 1
	}

	await Blog.findByIdAndUpdate(request.params.id, newInfo)
	response.json(newInfo)
})

module.exports = blogsRouter