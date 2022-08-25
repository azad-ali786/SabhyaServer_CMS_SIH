import mongoose, { Document } from 'mongoose';

export interface ResourceDoc extends Document {
    idEth: String;
    name: String;
    desc: String;
    file: String;
    thumbnail: String;
    keyWords: [String];
    minumunContribution: Number;
    subscribersCount: Number;
    downloadCount: Number;
    viewCount: Number;
}

const resource = new mongoose.Schema({
    intiId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute'
    },

    idEth: String,
    name: String,
    desc: String,
    file: String,
    fileIdx: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: 'https://readersend.com/wp-content/uploads/2018/04/book-sample_preview-1.png'
    },
    author: [String],
    keyWords: [String], //extract from description
    interests: [String], // will be given by the autor
    minumunContribution: {
        type: Number,
        default: 0
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    subscriber: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: ['Institute', 'User']
        }
    ]
});

export const ResourceModel = mongoose.model<ResourceDoc>('Resource', resource);
