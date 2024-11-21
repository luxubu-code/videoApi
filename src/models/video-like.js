import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

class VideoLike extends Model { }

VideoLike.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    videoId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'VideoLike',
    tableName: 'video_likes',
    timestamps: true,
    underscored: true,
});


export default VideoLike;