import bodyParser from "body-parser";
import Queue, { Job } from "bee-queue";
import express from "express";

interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    body: string;
};

const port = 8090;
const app = express();
app.use(bodyParser.json());

const emailQueue = new Queue("email-bee", {
    redis: "redis://localhost:6379",
});

const postEmail = async (email: EmailMessage): Promise<Job<EmailMessage>> => {
    console.log(`Posting email [${JSON.stringify(email)}] to queue`);
    return emailQueue.createJob({ ...email })
        .timeout(3000)
        .retries(2)
        .save();
};

app.post("/post-email", async (req, res) => {
    const { from, to, subject, body } = req.body;
    const job: Job<EmailMessage> = await postEmail({ from, to, subject, body });
    console.log(`Message from [${from}] to [${to}] was added to queue in message [${job.id}]`);
  
    res.json({
      message: `Email was sent at [${job.id}]`
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
 