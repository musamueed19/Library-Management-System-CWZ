// creating connection with MoogoDB Database
import moongose from "mongoose";

export async function connectDB() {
  // This async connection building "moongose.connect()" function takes following areguments
  /*
    - Database URI
    - options: {
      dbName: "any-db-name"
      }
      */

  // We can use, await , async/await, promise chaining, callback functions to handle the connection OR
  // We can use (async function).then().catch();

  try {
    await moongose.connect(process.env.MONGO_URI, {
      dbName: "Learning_Management_System_CWZ",
    });
    console.log("Database connected successfully...");
  } catch (err) {
    console.log("DB Connection Failed: ", err);
  }
}
