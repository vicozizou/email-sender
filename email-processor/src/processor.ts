import nodemailer from "nodemailer";
import { EmailMessage, EmailProcessor, Job } from "./EmailProcessor";
import { BeeEmailProcessor } from "./BeeEmailProcessor";
import { BullEmailProcessor } from "./BullEmailProcessor";

const redisUrl = "redis://localhost:6379";
const smptHost = "smtp.ethereal.email";
const smptPort = 587;

const resolveQueueOption = (): EmailProcessor => {
    const queueOption = process.env.QUEUE_OPTION || "BEE"
    switch(queueOption) {
        case "BEE":
            return new BeeEmailProcessor(redisUrl, processEmailQueue);
        case "BULL":
            return new BullEmailProcessor(redisUrl, processEmailQueue);
        default:
            throw new Error(`Invalid queue option: ${queueOption}`);
    }
}

const processEmailQueue = async (job: Job<EmailMessage>) => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: smptHost,
        port: smptPort,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });
  
    const { from, to, subject, text } = job.data;
    console.log("Sending mail to %s", to);
  
    const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html: `<strong>${text}</strong>`,
    });
  
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

const processor = resolveQueueOption();

processor.process();
