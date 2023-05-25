import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import router from './router/user.router';
import { handleError } from './utils/generateError';


const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('combined'));

app.use(router);
//@ts-expect-error
app.use(handleError)//FIX LATER


export default app;
