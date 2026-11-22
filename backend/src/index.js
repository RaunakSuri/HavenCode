import { app } from "./app.js";
import "dotenv/config";
import { useMongoose } from "./db/db.js";
import { userAuthRouter } from "./routes/userAuth.route.js";
import { redisClient } from "./db/redis.js";
import { problemRouter } from "./routes/problem.route.js";
import { submissionRouter } from "./routes/submission.route.js";
import { aiRouter } from "./routes/ai.route.js";

try {
  await Promise.all([useMongoose(), redisClient.connect()]);
  console.log("DB Connected Successfully");

  app.listen(process.env.PORT, () => {
    console.log(`Server Listening at PORT : ${process.env.PORT}`);
  });

  app.use("/user", userAuthRouter);
  app.use("/problem", problemRouter);
  app.use("/submission", submissionRouter);
  app.use("/ai", aiRouter);
} catch (error) {
  console.log(`Error Occured: ${error}`);
  process.exit(1);
}
