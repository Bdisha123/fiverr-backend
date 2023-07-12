import express from "express";
import mongoose from "mongoose";

import userRoute from "./routes/user.route.js"
import gigRoute from "./routes/gig.route.js"
import orderRoute from "./routes/order.route.js"
import conversationRoute from "./routes/conversation.route.js"
import messageRoute from "./routes/message.route.js"
import reviewRoute from "./routes/review.route.js"
import authRoute from "./routes/auth.route.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";
const app=express()
dotenv.config({path: './.env'});

mongoose.set('strictQuery', true)
const connect=async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb")
    } catch(error) {
        handleError(error);
    }
};
//"http://localhost:5173"
// app.use(cors({
//     origin: "http://localhost:5173"
//     , credentials: true
// }));

app.use(cors({
    origin: (origin, callback) => {
        // Check if the request has an allowed origin
        const allowedOrigins=["http://localhost:5173","https://64aefd03e90a461529ce0c4c--loquacious-macaron-895746.netlify.app/"];
        const isAllowed=allowedOrigins.includes(origin);
        callback(null, isAllowed? origin:false);
    },
    credentials: true
}));



// app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use("/api/users", userRoute);
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);



app.use((err, req, res, next) => {
    const errorStatus=err.status||500;
    const errorMessage=err.message||"Something went wrong";

    return res.status(errorStatus).send(errorMessage);
});

app.listen(8000, () => {
    connect();
    console.log("backend server is running")
})