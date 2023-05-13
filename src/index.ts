import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";



const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.listen(process.env.PORT);
