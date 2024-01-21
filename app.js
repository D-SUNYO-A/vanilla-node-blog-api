import http from "http";
import cluster from "cluster";
import os from 'os';
import cors from "cors";
import mongoose from "mongoose";
import * as fs from 'fs';
import { postController } from "./controllers/postController.js";
import { responseUtil } from "./utils/responseUtil.js";
import { upload } from "./middleware/upload.js";
import { getFilePath } from "./utils/pathUtil.js";

// Permettre l'accès depuis n'importe quelle origine
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: "GET",
};

const uri = "mongodb+srv://sdanarson1:YF078se0zrRptXYn@cluster0.ebxzpgl.mongodb.net/blog?retryWrites=true&w=majority";

const PORT = process.env.PORT || 3000;

// Utilisez le nombre de cœurs physiques disponibles
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary pid ${process.pid}`);
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = http.createServer((req, res) => {
        cors(corsOptions)(req, res, async () => {
            if (req.url.startsWith('/uploads/')) {
                const filePath = getFilePath(req.url, import.meta.url);
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.error(err);
                        responseUtil.sendResponse(res, 500, 'Internal Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        res.end(data);
                    }
                });
            } else if(req.url === '/api/posts' && req.method === 'POST') {
                upload(req, res, (err) => {
                    if (err) {
                        console.error(err);
                        responseUtil.sendResponse(res, 500, 'Internal Server Error');
                    } else {
                        postController.createPost(req, res);
                    }
                });
            } else if(req.url === '/api/posts' && req.method === 'GET') {
                postController.getPosts(req, res);  
            } else if(req.url.match(/\/api\/post\/([0-9]+)/) && req.method === 'GET') {
                const id = req.url.split('/')[3]; // api/post/1
                postController.getPost(req, res, id);
            } else if(req.url.match(/\/api\/post\/([0-9]+)/) && req.method === 'PUT') {
                const id = req.url.split('/')[3]; // api/post/1
                postController.updatePost(req, res, id);
            } else if(req.url.match(/\/api\/post\/([0-9]+)/) && req.method === 'DELETE') {
                const id = req.url.split('/')[3]; // api/post/1
                postController.deletePost(req, res, id);
            } else {
                responseUtil.responseNotFound(res);
            }
        });
    });  
    
    mongoose
        .connect(uri)
        .then(result => app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} and Connected to db`, process.pid);
        }))
        .catch(err => console.log(err))
}