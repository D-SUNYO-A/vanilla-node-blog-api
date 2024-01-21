import { Post } from "../models/postModel.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { responseUtil } from "../utils/responseUtil.js";
import { getDataUtil } from "../utils/getDataUtil.js";
import { getFilePath } from "../utils/pathUtil.js";
import * as fs from 'fs';

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

      if (!post) {
        responseUtil.sendResponse(res, 404, "Post Not Found");
      } else {
        responseUtil.sendResponse(res, 200, post);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // @desc  Create a Post
  // @route POST /api/posts
  createPost = async (req, res) => {
    uploadMiddleware.upload(req, res, (err) => {
      if (err) {
        console.error(err);
        responseUtil.sendResponse(res, 500, 'Internal Server Error');
      } else {
        const create = async () => {
          try {
            const { title, description } = req.body;

            let images = [];
            let videos = [];

            if (req.files) {
              // Utilisez req.files['images'] pour obtenir la liste des fichiers images
              if (req.files['images']) {
                  images = req.files['images'].map((file) => file.path);
              }

              // Utilisez req.files['videos'] pour obtenir la liste des fichiers videos
              if (req.files['videos']) {
                  videos = req.files['videos'].map((file) => file.path);
              }
            }

            const newPost = await Post.create({
              title,
              description,
              images,
              videos,
            });

            responseUtil.sendResponse(res, 201, newPost);
          } catch (error) {
            console.error(error);
            responseUtil.sendResponse(res, 500, "Internal Server Error");
          }
        }
        create();
      }
    });
  };

  // @desc  Update a Post
  // @route PUT /api/post/:id
  updatePost = async (req, res, id) => {
    try {
      const post = await Post.findById(id);

      if (!post) {
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
  };

  // @desc  Delete a Post
  // @route DELETE /api/post/:id
  deletePost = async (req, res, id) => {
    try {
      const post = await Post.findById(id);

      if (!post) {
        responseUtil.sendResponse(res, 404, "Post Not Found");
      } else {
        await post.deleteOne();
        responseUtil.sendResponse(res, 200, `Post ${id} removed`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // @desc  Gets Uploads Post
  // @route /uploads/
  getUploadsPost = (req, res, importMetaUrl) => {
    const filePath = getFilePath(req.url, importMetaUrl);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err);
        responseUtil.sendResponse(res, 500, "Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      }
    });
  };
})();
