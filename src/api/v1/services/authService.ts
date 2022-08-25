import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isValid } from '../utils/isValid';
import { UserDoc, UserModel } from '../models/user';
import { InstitueDoc, InstituteModel } from '../models/institute';
import { TYPES } from '../../../config/consts/index';
import { Document, Model } from 'mongoose';

/**
 *
 *  @Authservice by Jitul Teron
 *
 */

class AuthService {
    private _UserModel;
    private _InstituteModel;

    constructor({ UserModel, InstituteModel }: { UserModel: Model<UserDoc>; InstituteModel: Model<InstitueDoc> }) {
        this._UserModel = UserModel;
        this._InstituteModel = InstituteModel;
    }

    async generateAuthToken(model: UserDoc | InstitueDoc) {
        const token = jwt.sign({ id: model._id.toString() }, process.env.JWT_SECRECT as string);
        model.tokens?.push(token);
        await model.save();
        return token;
    }

    toJson(model: UserDoc | InstitueDoc) {
        let modelObj = model.toObject();
        delete modelObj.hash;
        delete modelObj.tokens;
        return modelObj;
    }

    generateForgotHashToken(user: any) {
        const payload = {
            email: user.email,
            _id: user._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRECT as string);
        return token;
    }

    checkResetToken(token: string) {
        jwt.verify(token, process.env.JWT_SECRECT as string, function (err: any, decoded) {
            console.log(err, 'err');
            if (err) {
                const error: any = new Error('Token Expired');
                error.StatusCode = 401;
                error.name = 'Unauthorized';
                throw error;
            }
        });
    }

    async checkAuthToken(token: string, _type: string) {
        const decode: any = jwt.verify(token, process.env.JWT_SECRECT as string);
        // console.log(decode, 'model data');
        let model: any;
        if (_type == TYPES.user) {
            model = await this._UserModel.findById(decode.id);
        } else if (_type == TYPES.institute) {
            model = await this._InstituteModel.findById(decode.id);
        }

        // console.log(model, 'model');
        if (isValid(model)) {
            const error: any = new Error('Unauthorized Admin');
            error.StatusCode = 401;
            error.name = 'Unauthorized Admin';
            throw error;
        }

        return model;
    }
    async login(email: string, hash: string, _type: string) {
        let model: any;
        if (_type == TYPES.user) {
            model = await this._UserModel.findOne({ email });
        } else if (_type == TYPES.institute) {
            model = await this._InstituteModel.findOne({ email });
        }

        console.log(model, '_type');
        if (!model) {
            const error: any = new Error('Account not found !');
            error.statusCode = 401;
            error.name = 'Unauthorized';
            throw error;
        }
        // bcrypt.
        // const isMatched = await bcrypt.compare(hash, model?.hash!);
        const isMatched = hash===model?.hash!?true:false;

        if (!isMatched) {
            const error: any = new Error('Hash is invalid');
            error.statusCode = 401;
            error.name = 'Unauthorized';
            throw error;
        }
        const token = <string>await this.generateAuthToken(model);
        return { user: this.toJson(model), token };
    }

    async signUp(data: any, _type: string) {
        try {
            const { email } = data;

            let check: any;
            if (_type == TYPES.user) {
                check = await this._UserModel.findOne({ email });
            } else if (_type == TYPES.institute) {
                check = await this._InstituteModel.findOne({ email });
            }

            if (check) {
                const error: any = new Error(`${_type.toUpperCase()}  already exists`);
                error.statusCode = 400;
                throw error;
            }

            let model: any;

            if (_type == TYPES.user) {
                model = await this._UserModel.create({
                    ...data
                });
            } else if (_type == TYPES.institute) {
                model = await this._InstituteModel.create({
                    ...data
                });
            }

            const token = await this.generateAuthToken(model);
            return { user: this.toJson(model), token };
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async logout(user: any, token: string) {
        for (var i = 0; i < user.tokens.length; i++) {
            if (user.tokens[i] === token) user.tokens.splice(i, 1);
        }

        await user.save();
        console.log(user, 'user');
        return user;
    }

    async logoutAll(user: any) {
        user.tokens = [];
        await user.save();
    }

    
}

export default AuthService;
