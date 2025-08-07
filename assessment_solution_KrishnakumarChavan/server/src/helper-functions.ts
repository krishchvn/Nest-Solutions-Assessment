import { pubsub, NOTIFY_RECIPIENT } from './pubsub.ts';

export default async function notifyRecipient(
	recipientName: string,
	senderName: string
) {
	const payload = { recipientName, senderName };
	await pubsub.publish(NOTIFY_RECIPIENT, { notifyRecipient: payload });

	console.log(`Notify recipient ${recipientName} from ${senderName}`);
}
