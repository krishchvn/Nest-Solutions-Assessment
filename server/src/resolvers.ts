import { db } from './db.ts';
import { analyticsResolvers } from './analytics.ts';
import { pubsub, NOTIFY_RECIPIENT } from './pubsub.ts';

export const resolvers = {
	Query: {
		employees: async () => {
			const res = await db.query('SELECT * FROM employees');
			return res.rows;
		},
		recognitions: async () => {
			const res = await db.query(`
				SELECT r.*, 
				s.id as s_id , s.name as s_name , s.email as s_email , s.role  as s_role , s.team as s_team , s.created_at as s_createdat ,
				rec.id as rec_id, rec.name as rec_name , rec.email as rec_email , rec.role as rec_role, rec.team as rec_team , rec.created_at as rec_createdat
				FROM recognitions r
				JOIN employees s ON r.sender_id = s.id
				JOIN employees rec ON r.recipient_id = rec.id
			`);

			return res.rows.map((row: any) => ({
				id: row.id,
				message: row.message,
				emoji: row.emoji,
				visibility: row.visibility,
				created_at: row.created_at,
				sender: {
					id: row.s_id,
					name: row.s_name,
					email: row.s_email,
					role: row.s_role,
					team: row.s_team,
					created_at: row.s_createdat,
				},
				recipient: {
					id: row.rec_id,
					name: row.rec_name,
					email: row.rec_email,
					role: row.rec_role,
					team: row.rec_team,
					created_at: row.rec_createdat,
				},
			}));
		},
		...analyticsResolvers.Query,
	},
	Mutation: {
		sendRecognition: async (_parent: any, args: any, context: any) => {
			const { senderId, recipientId, message, emoji, visibility } = args;

			const insertResult = await db.query(
				`INSERT INTO recognitions (sender_id, recipient_id, message, emoji, visibility) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
				[senderId, recipientId, message, emoji, visibility]
			);

			const recognition = insertResult.rows[0];

			// Fetch sender and recipient info
			const senderResult = await db.query(
				'SELECT * FROM employees WHERE id = $1',
				[senderId]
			);
			const recipientResult = await db.query(
				'SELECT * FROM employees WHERE id = $1',
				[recipientId]
			);

			return {
				...recognition,
				sender: senderResult.rows[0],
				recipient: recipientResult.rows[0],
			};
		},
	},

	Subscription: {
		notifyRecipient: {
			subscribe: () => pubsub.asyncIterableIterator(NOTIFY_RECIPIENT),
		},
	},
};
