const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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

afterAll(async () => {
	await mongoose.connection.close()
})