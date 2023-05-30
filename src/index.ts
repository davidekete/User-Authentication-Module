import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import router from './router/user.router';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('combined'));

app.use(router);

//Implement general error handling solution
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  }
});

export default app;
