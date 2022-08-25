import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDoc extends Document {
    name: String;
    password: String;
    schId: String;
    prove: Object;
    insititute: Object;
    img: String;
    subscriptionRate: {
        Wei: Number;
        //month:Number
    };
    subscribtion: Object;
    addressEth: String;
    tags: [String];
}

const user = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        prove: {
            status: Boolean,
            id: String
        },
        insititute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Intitute'
        },
        subscribtion: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Institute'
            }
        ],
        img: String,
        addressEth: String,
        tags: [String]
    },
    {
        timestamps: true
    }
);

user.pre('save', async function (next: mongoose.HookNextFunction) {
    let insti = this as UserDoc;

    if (!insti.isModified('password')) return next();

    if (insti.password == undefined) {
        throw new Error('password is undefined');
    }

    const hash = await bcrypt.hashSync(insti.password.toString(), 8);

    insti.password = hash;
    return next();
});

export const InstituteModel = mongoose.model<UserDoc>('Institute', user);
