const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.newBlogs)
})

test('blogs are returned as json', async () => {
  await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('get blogs returns the right amount of blogs', async () => {
	const res = await api.get('/api/blogs')
	expect(res.body).toHaveLength(6)
})

test('blogs are identified by id not _id', async () => {
	const res = await api.get('/api/blogs')
	expect(res.body[0]['_id']).not.toBeDefined
	expect(res.body[0]['id']).toBeDefined()
})

test('a blog can be added', async () => {
	const newBlog = {
		title: 'uusi kirja',
		author: 'minä',
		url: "www.github.com",
		likes: 1
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtTheEnd = await api.get('/api/blogs')
	expect(blogsAtTheEnd.body).toHaveLength(7)
	expect(blogsAtTheEnd.body[6]['author'].toBeDefined)
	expect(blogsAtTheEnd.body[6]['url'].toBeDefined)
	expect(blogsAtTheEnd.body[6]['title'].toBeDefined)
	expect(blogsAtTheEnd.body[6]['likes'].toBeDefined)
	expect(blogsAtTheEnd.body[6]['id'].toBeDefined)
})

test('a wrong-kind-of blog can not be added', async () => {
	const badBlog = {
		author: 'minä',
		url: 'yeeet',
		likes: 0
	}

	await api
		.post('/api/blogs')
		.send(badBlog)
		.expect(500)

	const blogsAtTheEnd = await api.get('/api/blogs')
	expect(blogsAtTheEnd.body).toHaveLength(6)
})

afterAll(async () => {
	await mongoose.connection.close()
})