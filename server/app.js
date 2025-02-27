// if do not specify "type" in the package.json, then we have to import file like this.
// const express = require("express");

// If we want to use 'import' keyword, then mention the "type" in the package.json
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// database setup
import { connectDB } from "./database/db.js";

// errorMiddleware setup
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

export const app = express();

config({ path: "./config/config.env" });
config({path: './.env'})

// Whenver  we want to use the environment variables, we can use the process.env

// Whenever, we want to use middleware, we can use "app.use()" function, like "express.json()" is a middleware

// earlier we use "bodyparser" named package, normally, the below middleware is used to ease communication between frontend and backend
// because, the http communication is normally in the, JSON format.
// We are using builtin middleware to ease JSON communication, we can ignore this, if we are using third-party packages for this functionality
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());


// database function
connectDB();


// use errorMiddleware at the last
app.use(errorMiddleware);
