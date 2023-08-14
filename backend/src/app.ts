import "dotenv/config";
import express from "express";
import { errorHandler} from "../middleware/errorHandler"
import workspaceRoutes from "./routes/category";
import testRouter from "./routes/testRoutes";

const app = express();

app.use(express.json());
app.use("/", testRouter)
app.use("/api/workspaces", workspaceRoutes);

app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorHandler);

export default app;