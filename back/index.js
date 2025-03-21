import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRoute.js";
import { walletRouter } from "./routes/walletRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/wallets", walletRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server rodando em http://localhost:${PORT}`));