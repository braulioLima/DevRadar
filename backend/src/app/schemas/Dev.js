import mongoose from 'mongoose';
import PointSchema from './utils/PointSchema';
/**
 * Schema to represent Notification
 */
const DevSchema = new mongoose.Schema(
  {
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Dev', DevSchema);
