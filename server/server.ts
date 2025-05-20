import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
  connectDB();
});
