const express = require("express");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const { seedUser } = require("./controllers/seedController");
const seedRouter = require("./routers/seedRouter");
const errorResponse = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const { cookie } = require("express-validator");
const cookieParser = require("cookie-parser");
const app = express();

const rateLimiter = rateLimit({
    windowMs: 1*60*1000, //1 minute
    max: 10,
    message: "Too many request from this ip."
})
app.use(cookieParser)
app.use(rateLimiter)
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.user("api/auth", authRouter);

app.get("/api/users", (req,res)=>{
    console.log(req.body.id);
    res.status(200).send({
        message: "User profile is returned"
    })
})

//client error handling
app.use((req,res,next) =>{
    next(createError(404, 'route not found'));
});

//server error handling
app.use((err, req, res ,next) =>{
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });

    return errorResponse(res,{
        statusCode: err.status,
        message: err.message,
    })
})
module.exports = app;