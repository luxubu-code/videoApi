import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Hàm tạo database nếu chưa tồn tại
const createDatabase = async () => {
  try {
    const tempConnection = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    });

    // Tạo database nếu chưa tồn tại
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
    console.log('Database đã được tạo thành công (nếu chưa tồn tại).');
    await tempConnection.close();
  } catch (err) {
    console.error('Lỗi khi tạo database:', err);
  }
};

// Hàm kiểm tra kết nối database
const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');
  } catch (err) {
    console.error('Kết nối cơ sở dữ liệu thất bại:', err);
  }
};

export { sequelize, createDatabase, checkDatabaseConnection };
