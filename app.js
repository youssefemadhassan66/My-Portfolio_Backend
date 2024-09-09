const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const DBconnection = require('./Config/DBconfig');
const PageRoute =  require('./Routes/PageRoute');
const LoginRoute = require('./Routes/LoginRoute');
const UserRoute = require('./Routes/UserRoute');
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin:'https://my-portofolio-fornt-end.vercel.app',
    methods: ['GET','POST','DELETE'],
    credentials :true
}));

DBconnection();

app.use('/user',UserRoute);
app.use('/login',LoginRoute);
app.use('/',PageRoute);

app.listen(port, "0.0.0.0",()=>{
    console.log(`server is running on port ` + port);
})