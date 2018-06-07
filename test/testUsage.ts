import { middleware } from './../lib/index';
import express from 'express';

import { scenarios } from './testScenarios';
 
const port = 3002;
process.env.__NODE_ENV__ = 'development';
 
const app = express();
app.use(middleware(scenarios));
app.listen(port);
// tslint:disable-next-line no-console
console.log(`Running mock scenario server on localhost:${port}`);