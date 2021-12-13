import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, maxlength: 200 },
    createdAt: { type: Date, default: Date.now , required: true },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
    },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(',').map(word => word.startsWith('#') ? word : `#${word.trim()}`)
});

const Video = model('Video', videoSchema);

export default Video;