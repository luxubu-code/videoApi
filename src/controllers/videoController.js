import Video from '../models/video.js';
import cloudinary from '../../config/cloudinary.js';
import VideoService from '../services/video.service.js';

const createVideo = async (req, res) => {
    try {
        const { title, description } = req.body;
        // Kiểm tra xem các trường dữ liệu có tồn tại không
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("File:", req.file);
        if (!title || !description || !req.file) {
            throw new Error('Thiếu thông tin bắt buộc');
        }
        const tmpFilePath = req.file.path;
        const result = await VideoService.upLoadVideoToCloundinary(tmpFilePath);

        const video = await Video.create({
            title,
            description,
            videoUrl: result.secure_url, // URL video từ Cloudinary
            public_id: result.public_id, // ID video từ Cloudinary
            userId: '1',
            like: 0,
            view: 0
        });
        res.status(201).json(video);
        return video;
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Lỗi khi tạo video' });
    }
};

const getVideos = async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = '-created_at', userId, hastag, trending } = req.query;
        const conditions = {};
        if (userId) {
            conditions.userId = userId;
        }
        if (hastag) {
            conditions.category = category;
        }
        const options = {
            where: conditions,
            order: [[sort.startsWith('-') ? sort.slice(1) : sort, sort.startsWith('-') ? 'DESC' : 'ASC']],
            offset: (page - 1) * limit,
            limit: parseInt(limit)
        };
        let videos;
        if (trending === 'true') {
            // Lọc video trending
            options.order = [['views', 'DESC'], ['likes', 'DESC']];
            options.limit = 4;
        }

        videos = await Video.findAll(options);
        const total = await Video.count({ where: conditions });
        res.status(200).json({ videos, total });
    } catch (err) {
        console.error(err);
        const status = err.name === 'ValidationError' ? 400 : 500;
        res.status(status).send({ message: err.message || 'Lỗi khi lấy danh sách video' });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findByPk(id);
        if (!video) {
            return res.status(404).send({ message: 'Không tìm thấy video' });
        }
        console.log("Public ID:", video.public_id);

        // Thực hiện xóa video trên Cloudinary và kiểm tra kết quả trả về
        const result = await cloudinary.uploader.destroy(video.public_id, { resource_type: "video" });

        if (result.result !== 'ok') {
            return res.status(500).send({ message: 'Lỗi khi xóa video trên Cloudinary', result });
        }

        // Xóa bản ghi video khỏi cơ sở dữ liệu sau khi xóa trên Cloudinary thành công
        await video.destroy();
        res.status(200).send({ message: 'Xóa video thành công', public_id: video.public_id });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Lỗi khi xóa video' });
    }
};
const updateVideos = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!id || !title || !description) {
            throw new Error('Thiếu thông tin bắt buộc');
        }
        const video = await Video.findByPk(id);
        if (!video) {
            throw new Error('Không tìm thấy video');
        } else {
            video.title = title;
            video.description = description;
            await video.save();
            res.status(200).json(video);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Lỗi khi cập nhật video' });
    }
};



export { createVideo, getVideos, deleteVideo, updateVideos };