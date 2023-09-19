const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
	const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    passwordHash,
		name
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter