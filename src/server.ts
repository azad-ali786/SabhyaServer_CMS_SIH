import app from './api/v1/app';
import http from 'http';
import chalk from 'chalk';
import { SERVER_PORT } from './config/configVar';
import connect from './db/mongoose';
import CONST from './config/consts';
//import connect from './db/sql';
const { NAMESPACE } = CONST;

const server = http.createServer(app);

server.listen(SERVER_PORT, () => {
    console.info(chalk.bgWhite.black.bold(`Connecting to Server on port ${SERVER_PORT}`));
    console.info(chalk.bgWhite.black.bold(`API templted by Jitul Teron`));
    connect();
});
