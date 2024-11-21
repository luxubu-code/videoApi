import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
class Video extends Model { }
Video.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descriptions: {
        type: DataTypes.STRING,
        allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING(2083),
        allowNull: false
    },
    public_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnailUrl: {
        type: DataTypes.STRING,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },

}, {
    sequelize,
    modelName: 'Video',
    tablename: 'videos',
    timestamps: true,
    underscored: true,
});
export default Video;