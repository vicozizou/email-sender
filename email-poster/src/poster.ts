import bodyParser from "body-parser";
import express from "express";
import { EmailMessage, EmailPoster } from "./EmailPoster";
import { BeeEmailPoster } from "./BeeEmailPoster";
import { BullEmailPoster } from "./BullEmailPoster";

const redisUrl = "redis://localhost:6379";
const resolveQueueOption = (): EmailPoster<EmailMessage> => {
    const queueOption = process.env.QUEUE_OPTION || "BEE"
    switch(queueOption) {
        case "BEE":
            return new BeeEmailPoster(redisUrl);
        case "BULL":
            return new BullEmailPoster(redisUrl);
        default:
            throw new Error(`Invalid queue option: ${queueOption}`);
    }
}

const emailPoster: EmailPoster<EmailMessage> = resolveQueueOption();
const port = 8090;
const app = express();
app.use(bodyParser.json());

app.post("/post-email", async (req, res) => {
    const { from, to, subject, body } = req.body;
    const job = await emailPoster.postEmail({ from, to, subject, body });
    console.log(`Message from [${from}] to [${to}] was added to queue`);
  
    res.json({
      message: `Email sent, job id: [${job.id}]`,
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
