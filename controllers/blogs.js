const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { name: 1, username: 1, id: 1 })
	response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  	const body = request.body

	const users = await User.find({ 'name': /^M/})
	const user = users[0]

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user.id
	})
  
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog.id)
	await user.save()

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