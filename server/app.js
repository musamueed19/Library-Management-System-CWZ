// if do not specify "type" in the package.json, then we have to import file like this.
// const express = require("express");

// If we want to use 'import' keyword, then mention the "type" in the package.json
import express from "express";
import { config } from "dotenv";

export const app = express();

config({ path: "./config/config.env" });

// Whenver  we want to use the environment variables, we can use the process.env

// Whenever, we want to use middleware, we can use "app.use()" function, like "express.json()" is a middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
