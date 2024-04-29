import Queue, { Job } from "bee-queue";
import { EmailMessage, EmailProcessor } from "./EmailProcessor";

export class BeeEmailProcessor implements EmailProcessor {

    private readonly emailQueue: Queue<EmailMessage>;
    private readonly sendEmailFn: (job: Job<EmailMessage>) => void;

    constructor(redisUrl: string, sendEmailFn: (job: Job<EmailMessage>) => void) {
        this.emailQueue = new Queue("email-bee", {
            redis: redisUrl
        });
        this.sendEmailFn = sendEmailFn;
    }

    public process = () => {
        this.emailQueue.process(this.sendEmailFn);
    }

}
