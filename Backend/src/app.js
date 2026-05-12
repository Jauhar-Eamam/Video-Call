import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./router/auth.routes.js";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {connectToSocket} from "./controllers/socketManager.js";
import http from "http"

const app = express();
const server = http.createServer(app);

app.use(cors({
  credentials: true,
  origin: "*"
}));
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}))
app.use(cookieParser());

app.use("/api/auth", authRouter);

export {app, server};
