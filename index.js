//require('dotenv').config()
//const app = express()
const app = require('./app')
const config = require('./utils/config')


//const Blog = mongoose.model('Blog', blogSchema)

//app.use(cors())
//app.use(express.json())


app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})