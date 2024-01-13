import { Post } from "../models/postModel.js"; 
import { getDataUtil } from "../utils/getDataUtil.js";
import { responseUtil } from "../utils/responseUtil.js";

export const postController = new (class {
  // @desc  Gets All Posts
  // @route GET /api/posts
  getPosts = async (req, res) => {
    try {
      const posts = await Post.find();
      responseUtil.sendResponse(res, 200, posts);
    } catch (error) {
      console.error(error);
    }
  };

  // @desc  Gets Single Post by id
  // @route GET /api/post/:id
  getPost = async (req, res, id) => {
    try {
      const post = await Post.findById(id);

      if(!post) {
        responseUtil.sendResponse(res, 404, "Post Not Found");
      } else {
        responseUtil.sendResponse(res, 200, post);
      }

    } catch (error) {
      console.error(error);
    }
  }

  // @desc  Create a Post
  // @route POST /api/posts
  createPost = async (req, res) => {
    try {
      const body = await getDataUtil.post(req);

      const { title, description } = JSON.parse(body);

      const post = {
        title, 
        description
      }

      const newPost = await Post.create(post);
      
      responseUtil.sendResponse(res, 201, newPost);

    } catch (error) {
      console.error(error);
    }
  }

  // @desc  Update a Post
  // @route PUT /api/post/:id
  updatePost = async (req, res, id) => {
    try {
      const post = await Post.findById(id);

      if(!post) {
        responseUtil.sendResponse(res, 404, "Post Not Found");
      } else {
        const body = await getDataUtil.post(req);

        const { title, description } = JSON.parse(body);

        const updateFields = {
          title: title || post.title,
          description: description || post.description,
        };
        
        Object.assign(post, updateFields);
        
        const updPost = await post.save();
        
        responseUtil.sendResponse(res, 200, updPost);
      }

    } catch (error) {
      console.error(error);
    }
  }

  // @desc  Delete a Post
  // @route DELETE /api/post/:id
  deletePost = async (req, res, id) => {
    try {
      const post = await Post.findById(id);

      if(!post) {
        responseUtil.sendResponse(res, 404, "Post Not Found");
      } else {
        await post.deleteOne();
        responseUtil.sendResponse(res, 200, `Post ${id} removed`);
      }

    } catch (error) {
      console.error(error);
    }
  }
})();
