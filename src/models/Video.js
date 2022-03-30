import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
    title: { type: String, required: true, trim: true, maxlength: 80 },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, maxlength: 20 },
    createdAt: { type: Date, default: Date.now , required: true },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
    },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
})

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags
        .split(',')
        .map(word => word.startsWith('#') ? word : `#${word.trim()}`)
});

const Video = model('Video', videoSchema);

export default Video;