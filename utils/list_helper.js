const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
	var total = blogs.reduce(function(sum, blog) {
		return sum + blog.likes
	}, 0)

	return total
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}
	var favorite = blogs.reduce((prev, current) => {
		return prev.likes > current.likes ? prev : current
	}, blogs[0])

	return favorite
}

module.exports = {
  dummy,
	totalLikes,
	favoriteBlog
}