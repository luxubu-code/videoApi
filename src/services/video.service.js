import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { finished } from 'stream/promises';
import Video from '../models/video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class VideoService {
    static async findVideoById(id) {
        const video = Video.findVideoById(id);
        if (!video) {
            console.errror('ko tìm thấy video');
            throw new Error('Video không tồn tại');
        }
        return video;
    }
    static async upLoadVideoToCloundinary(filePath) {
        try {
            return await cloudinary.uploader.upload(filePath, {
                resource_type: 'video',
                folder: 'videos',
                eager: [
                    { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
                    { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
                ],
                eager_async: true,
                transformation: [{ quality: "auto" }
                    , { fetch_format: "auto" }
                ]
            });
        } catch (error) {
            console.error('Error uploading video to cloudinary:', error);
            throw new Error('Lỗi khi tải video lên cloudinary');
        }
    }
    static async handleTempFile(file) {
        const { createReadStream, filename } = await file;
        const stream = createReadStream();
        const publicDir = path.join(__dirname, '../publics/temp');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        const tmpFilePath = path.join(publicDir, filename);
        const writeStream = fs.createWriteStream(tmpFilePath);
        stream.pipe(writeStream);
        await finished(writeStream);
        return tmpFilePath;
    }
}
export default VideoService;