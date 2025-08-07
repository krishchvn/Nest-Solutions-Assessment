import { PubSub } from 'graphql-subscriptions';

export type NotificationPayload = {
	recipientName: string;
	senderName: string;
};
export const pubsub = new PubSub();

export const NOTIFY_RECIPIENT = 'NOTIFY_RECIPIENT';
