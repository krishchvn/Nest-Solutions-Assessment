## Subscriptions

### (server/src/helper-functions.ts, resolvers.ts)

### 1. Notify Recipients

    I have created a subscription that sends a notification to the recipient whenever a new recognition
    is created for the employee.
    For now, I have created a function notifyRecipient and called it everytime sendRecognition() is called
    and has been succesfully executed.
    I have used pub-sub and graphql subscriptions for this service.

    I'm just console logging the notification for now, but later on we can

    1. Create a database seperate for tables consisting of recipient, sender, message, timestamp, status,
    etc and perform operations on the table. This way, using WebSockets, we can also enable read recepits
    if required. We can also fallback on Http Polling every 10 seconds/minutes to keep service enabled.

    2. Some queue service can be used such as RabbitMQ, or what I would suggest is AWS SQS with AWS SES (Simple
    Email Service) as that is easy to use and we don't have to worry about traffic.

    3. We can use Graph API provided by Teams and use endpoints to trigger mutation or notification service.


    Full Flow of notifyRecipient (assuming frontend and notification db is already built):
    1. Frontend triggers a recognition

    2. notifyRecipient() publishes to pubsub

    3. Pubsub pushes real-time updates (if online)

    4. Inserts notification in DB

    5. Publishes job to queue

    (If batching and integration is enabled):

    5.1. Appluy batching logic

    5.2  Sends to Slack/Teams

    6. UI shows notifications + mark as read/unread
