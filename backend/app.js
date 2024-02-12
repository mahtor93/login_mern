import  express  from "express";
import dbMain from "./config/db.config.js";
import cors from 'cors';
import bodyParser from "body-parser";
import router from "./routes/routes.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use('*', cors());

app.use(bodyParser.json());

dotenv.config({
    path:'.env'
})

dbMain().catch(console.error);

app.use('/api/v1',router);

const port = process.env.PORT || 5000;

const allowedOrigins = [
    '*',
];
/*
app.use(cors(
    {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }
));
*/

app.get('/', (req,res)=>{
    res.send('Hoolaa po');
});

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
});

