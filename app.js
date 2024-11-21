import express from 'express';
import cors from 'cors';
import { sequelize, checkDatabaseConnection, createDatabase } from './config/database.js';
import { router } from './routes/api.js';
import { createVideo } from './src/controllers/videoController.js';
import multer from 'multer';


const app = express();
const upload = multer({ dest: 'uploads/' });
// Middleware xử lý JSON của Express
app.use(cors());
app.use(express.json());
app.post('/api/videos', upload.single('file'),createVideo);
app.use('/api', router);
// Hàm khởi động server
async function startServer() {
  try {
    // Tạo database nếu chưa tồn tại
    await createDatabase();

    // Kiểm tra kết nối cơ sở dữ liệu
    await checkDatabaseConnection();

    await sequelize.sync({ force: false });// `sequelize.sync({ force: true q})` để xóa và tạo lại bảng

    // Khởi động server
    app.listen(8000, () => {
      console.log('🚀 Server đang chạy tại http://localhost:8000');
    });
  } catch (error) {
    console.error('Lỗi khi khởi động server:', error);
  }
}

// Gọi hàm khởi động server
startServer();
