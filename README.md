# Email Sender
Consists a simple piece of software written in Typescript which send emails using a queue (implemented in Bull).

## Stack
The tech stack is pretty simple:
- An API endpoint based on Express.js which is in charge of enqueueing the messages
- A second component which will dequeue elments from the email queue and actually perform the send logic

The email sender to be used is ethereal.email to actually don't send any email but that will make it possible to check that at least the message got to a SMTP server.
