import { EmailPoster } from "./EmailPoster";
import Bull, {Job} from "bull";

export interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    body: string;
};

export class BullEmailPoster implements EmailPoster<EmailMessage> {

    private readonly emailQueue;

    constructor(redisUrl: string) {
        this.emailQueue = new Bull("email-bull", {
            redis: redisUrl
        });
    }

    public async postEmail(email: EmailMessage): Promise<Job<EmailMessage>> {
        console.log(`Posting email [${JSON.stringify(email)}] to queue`);
        return this.emailQueue.add({ ...email });
    }

}
