import Queue, { Job } from "bee-queue";
import nodemailer from "nodemailer";

const smptHost = "smtp.ethereal.email";
const smptPort = 587;

interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    text: string;
};

const emailQueue = new Queue("email-bee", {
    redis: "redis://localhost:6379",
});

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
  
emailQueue.process(processEmailQueue);
