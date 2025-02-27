// Import the app instance
import { app } from "./app.js";

// Whenver  we want to use the environment variables, we can use the process.env
const port = process.env.PORT || 5000;

try {
    app.listen(port, () => {
      console.log(
        `server is running on port ${port}\n http://localhost:${port}`
      );
    });
} catch (error) {
    console.log(error);
}