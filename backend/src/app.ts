import "dotenv/config";
import express from "express";
import { errorHandler } from "../middleware/errorHandler"
import workspaceRoutes from "./routes/category";
import userRoutes from "./routes/user";
import testRouter from "./routes/testRoutes";
import createHttpError from "http-errors";
import cors from "cors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "../middleware/auth";

const app = express();

// Your code
if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'), function (err) {
            if (err) {
                res.status(500).send(err)
            }
        });
    })
}
// Your code

app.use(cors(
    {
        origin: ["http://localhost:3000"],
    }
));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/", testRouter)
app.use("/api/users", userRoutes);
app.use("/api/category", requiresAuth, workspaceRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorHandler);

export default app;