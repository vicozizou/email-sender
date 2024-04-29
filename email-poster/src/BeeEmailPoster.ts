import Queue, { Job } from "bee-queue";
import { EmailMessage, EmailPoster } from "./EmailPoster";

export class BeeEmailPoster implements EmailPoster<EmailMessage> {

    private readonly emailQueue: Queue<EmailMessage>;

    constructor(redisUrl: string) {
        this.emailQueue = new Queue("email-bee", {
            redis: redisUrl
        });
    }

    public async postEmail(email: EmailMessage): Promise<Job<EmailMessage>> {
        console.log(`Posting email [${JSON.stringify(email)}] to queue`);
        return this.emailQueue.createJob({ ...email })
            .timeout(3000)
            .retries(2)
            .save();
    }
   
}
