import { Job as BeeJob } from "bee-queue";
import { Job as BullJob } from "bull";

export enum QueueOption {
    BEE, BULL
}

export type Job<T> = BullJob<T> | BeeJob<T>;

export interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    text: string;
};

export interface EmailProcessor {
    process(): void;
}
