import bodyParser from "body-parser";
import Bull from "bull";
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

const emailQueue = new Bull("email", {
    redis: "localhost:6379",
});

const postEmail = async (email: EmailMessage) => {
    console.log(`Posting email [${JSON.stringify(email)}] to queue`);
    emailQueue.add({ ...email });
};

app.post("/post-email", async (req, res) => {
    const { from, to, subject, body } = req.body;
    await postEmail({ from, to, subject, body });
    console.log(`Message from [${from}] to [${to}] was added to queue`);
  
    res.json({
      message: "Email was sent",
    });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
 