import { sequelize } from '../../config/database.js';
import User from './user.js';
import Video from './video.js';
import VideoLike from './video-like.js';


User.hasMany(Video, {
    foreignKey: 'userId',
    as: 'videos',
    onDelete: 'cascade',
    hooks: true
});
Video.belongsTo(User, {
    foreignKey: 'userId',
    as: 'author', onDelete: 'CASCADE'
});
User.hasMany(VideoLike, {
    foreignKey: 'userId',
    as: 'likes',
    onDelete: 'cascade',
    hooks: true
});
VideoLike.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user', onDelete: 'CASCADE'
});
Video.hasMany(VideoLike, {
    foreignKey: 'videoId',
    as: 'havelikes',
    onDelete: 'cascade',
    hooks: true
});
VideoLike.belongsTo(Video, {
    foreignKey: 'videoId',
    as: 'video', onDelete: 'CASCADE'
});


const syncModels = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('sync database success');
    } catch (error) {
        console.error('sync database error', error);
    }
}
export { syncModels, Video, User, VideoLike };