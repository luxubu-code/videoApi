import User from '../models/user.js';
import client from '../../config/google.js';
import jwt from 'jsonwebtoken';
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};
const login = async (req, res) => {
    try {
        const { googleId } = req.params;
        if (!googleId || googleId.trim() === '') {
            return res.status(400).send({ message: 'googleId is missing or empty' });
        }
        // Xác thực ID token từ Google
        const ticket = await client.verifyIdToken({
            idToken: googleId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ where: { googleId: payload.sub } });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            const token = generateToken(existingUser);
            return res.status(200).send({ user: existingUser, token }); // Thêm `return` tại đây
        }

        // Tạo người dùng mới nếu không tồn tại
        const newUser = await User.create({
            username: payload.name,
            name: payload.name,
            email: payload.email,
            imageUrl: payload.picture,
            googleId: payload.sub,
        }); if (!newUser.id) {
            throw new Error("Failed to create user with ID.");
        }
        const token = generateToken(newUser);
        res.status(201).send({ user: newUser, token });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Lỗi khi tạo user', error: err.message, });
    }
};
// const login = async (req, res) => { };


export { login };