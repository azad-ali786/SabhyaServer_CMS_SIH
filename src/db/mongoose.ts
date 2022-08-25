import mongoose from "mongoose"
import config from '../config/configVar';
import {NAMESPACE} from '../config/consts';
import logger from '../config/logger';

function connection() {
    return mongoose
        .connect(config.mongo.url, config.mongo.options)
        .then((result) => {
            logger.info(NAMESPACE, 'Mongo Connected');
        })
        .catch((error) => {
            logger.error(NAMESPACE, error.message, error);
        });
}

export default connection;
