import express from 'express';
import { getVideos, deleteVideo, updateVideos } from '../src/controllers/videoController.js';
import { login } from '../src/controllers/userController.js';
const router = express.Router();

// router.post('/videos', createVideao);
router.get('/videos', getVideos);
router.delete('/videos/:id', deleteVideo);
router.put('/videos/:id', updateVideos);
router.post('/login/:googleId', login);

export { router };