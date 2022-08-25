import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';

declare global {
    namespace Express {
        interface Request {
            token: string;
            admin: any | null;
        }
    }
}

const multipleRouteAuth = (authtype: string) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.token = <string>req.headers['auth'];
            if (req.admin == null) {
                const error: any = new Error('Unauthorized Admin');
                error.StatusCode = 401;
                error.name = 'Unauthorized Admin';
                throw error;
            } else {
                return next();
            }
        } catch (error: any) {
            console.log(error, 'error from middleware');
            throw new Error(error);
        }
    });
};

export default multipleRouteAuth;
