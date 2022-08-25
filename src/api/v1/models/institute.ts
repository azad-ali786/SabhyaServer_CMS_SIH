import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
export interface InstitueDoc extends Document {
    name: String;
    password: String;
    instiID: String;
    pin: Number;
    Details: String;
    img: String;
    SubscriptionRate: {
        Wei: Number;
        //month:Number
    };

    AddressEth: String;
    Subscriber: Number;
    Subscribtion: Number;
    Tags: [String];
}

const institute = new mongoose.Schema(
    {
        name: String,
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        instiID: String,
        pin: Number,
        Details: String,
        img: String,
        SubscriptionRate: {
            Wei: Number
            //month:Number
        },
        AddressEth: String,
        Subscriber: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        Subscribtion: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Institute'
            }
        ],
        Tags: [String]
    },
    {
        timestamps: true
    }
);


institute.pre('save', async function (next: mongoose.HookNextFunction) {
    let insti = this as InstitueDoc;

    if (!insti.isModified('password')) return next();

    if (insti.password == undefined) {
        throw new Error('password is undefined');
    }

    const hash = await bcrypt.hashSync(insti.password.toString(), 8);

    insti.password = hash;
    return next();
});


export const InstituteModel = mongoose.model<InstitueDoc>('Institute', institute);
