const Router = require("express").Router();
const Blog = require("../models/blog");
/**
Router.get("/", (req, res, next) => {
  Blog.find({}).then(blogs => {
    console.log(blogs);
    res.json(blogs.map(blog => blog.toJSON()));
  });
});

Router.post("/", async (req, res, next) => {
  const blog = new Blog(req.body);

  await blog.save();
  res.status(201).json(blog.save());
});

 */

Router.get("/", async (req, res, next) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => blog.toJSON()));
});

Router.post("/", async (req, res, next) => {
  const body = req.body;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  try {
    const savedBlog = await blog.save();
    res.status(201);
    res.json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = Router;
