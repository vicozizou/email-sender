import Bull, { Job } from "bull";
import { EmailMessage, EmailProcessor } from "./EmailProcessor";

export class BullEmailProcessor implements EmailProcessor {

    private readonly emailQueue;
    private readonly sendEmailFn: (job: Job<EmailMessage>) => void;

    constructor(redisUrl: string, sendEmailFn: (job: Job<EmailMessage>) => void) {
        this.emailQueue = new Bull("email-bull", {
            redis: redisUrl
        });
        this.sendEmailFn = sendEmailFn;
    }

    public process = () => {
        this.emailQueue.process(this.sendEmailFn);
    }

}
