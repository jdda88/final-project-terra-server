import express from "express";
import morgan from "morgan";
import connectDB from "./config/mongoose.config.js";
import * as dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import planRouter from "./routes/plan.routes.js";

//import routes

dotenv.config();

const app = express();
const logger = morgan("dev");

app.use(express.json()); //to have access to req body
app.use(logger);
app.use(cors({origin: [process.env.REACT_URL]}))

//ROUTES app.usec

app.use("/user", userRouter);
app.use("/plan", planRouter);
app.use("/review", reviewRouter);


app.listen(process.env.PORT, () => {
  console.clear();
  console.log("Server is 🏃‍♀️on port:", process.env.PORT);
  connectDB();
});
