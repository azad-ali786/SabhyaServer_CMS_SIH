import mongoose, { Document } from 'mongoose';

export interface ResourceDoc extends Document {
    idEth: String;
    name: String;
    desc: String;
    file: String;
    thumbnail: String;
    keyWords: [String];
    minumunContribution: Number;
    //subscribersCount:Number,  subscribtion for file ?
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
    thumbnail: String,
    author: [String],
    keyWords: [String],
    minumunContribution: Number,
    downloadCount: Number,
    viewCount: Number
    //subscribersCount:Number,  subscribtion for file ?
});

export const ResourceModel = mongoose.model<ResourceDoc>('Resource', resource);
