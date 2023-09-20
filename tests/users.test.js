const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
	await User.deleteMany({})

	let passwordHash = await bcrypt.hash('salasana', 10)
	let user = new User({ username: 'käyttäjä', passwordHash: passwordHash, name: 'Matti Mallikas'})
	await user.save()

	passwordHash = await bcrypt.hash('password', 10)
	user = new User({ username: 'käyttäjä2', passwordHash: passwordHash, name: 'Maija Mallikas'})
	await user.save()
})

test('a new user can be added', async () => {
	const newUser = {
		username: 'yeetinTeetin',
		password: "kissa123",
		name: 'Pekka Kepakko'
	}

	await api
		.post('/api/users')
		.send(newUser)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const users = await User.find({})
	const usersAtTheEnd = users.map(user => user.toJSON())

	expect(usersAtTheEnd).toHaveLength(3)
	expect(usersAtTheEnd[2]['username']).toEqual('yeetinTeetin')
})

test('user can not be added if the username is too short', async () => {
	const newUser = {
		username: 'y',
		password: "kissa123",
		name: 'Pekka Kepakko'
	}

	await api
		.post('/api/users')
		.send(newUser)
		.expect(500)

	const users = await User.find({})
	const usersAtTheEnd = users.map(user => user.toJSON())

	expect(usersAtTheEnd).toHaveLength(2)
})

test('user can not be added if the password is too short', async () => {
	const newUser = {
		username: 'yeetinTeetin',
		password: "12",
		name: 'Pekka Kepakko'
	}

	await api
		.post('/api/users')
		.send(newUser)
		.expect(403)
	
	const users = await User.find({})
	const usersAtTheEnd = users.map(user => user.toJSON())

	expect(usersAtTheEnd).toHaveLength(2)
})

afterAll(async () => {
  await mongoose.connection.close()
})