import { gql } from 'apollo-server';

export const typeDefs = gql`
	enum Role {
		EMPLOYEE
		MANAGER
		TEAMLEAD
		HR_ADMIN
	}

	enum Visibility {
		PUBLIC
		PRIVATE
		ANONYMOUS
	}

	type Employee {
		id: ID!
		name: String!
		email: String!
		role: Role!
		team: String
		created_at: String
	}

	type Recognition {
		id: ID!
		message: String!
		emoji: String
		visibility: Visibility!
		created_at: String
		sender: Employee!
		recipient: Employee!
	}

	type Count {
		count: Int!
	}

	type Engagement {
		employee_id: ID!
		recognition_count: Int!
	}

	type DeleteRecognitionResponse {
		success: Boolean!
		message: String!
	}

	type Query {
		employees: [Employee!]!
		recognitions: [Recognition!]!
		recognitionsByTeam: Int!
		recognitionsByKeyword: [Recognition]!
		recognitionEngagementLevels: [Engagement!]!
	}
	type Mutation {
		sendRecognition(
			senderId: ID!
			recipientId: ID!
			message: String!
			emoji: String
			visibility: Visibility!
		): Recognition!

		deleteRecognition(id: ID!): DeleteRecognitionResponse!
	}

	type NotificationPayload {
		recipientName: String!
		senderName: String!
	}

	type Subscription {
		notifyRecipient: NotificationPayload!
	}
`;
