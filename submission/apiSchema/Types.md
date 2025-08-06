## Enums

### (server/src/typedef.ts)

    enum Role {
    	EMPLOYEE
    	MANAGER
    	TEAMLEAD
    }  // These are roles for hierarchy and role based access later on

    enum Visibility {
    	PUBLIC
    	PRIVATE
    	ANONYMOUS
    }  // These are for visibility of self, anonymous or public for recognitions

    type Employee {
    	id: ID!
    	name: String!
    	email: String!
    	role: Role!
    	team: String
    	created_at: String
    }  // These are attributes every employee would have in database


    type Recognition {
    	id: ID!
    	message: String!
    	emoji: String
    	visibility: Visibility!
    	created_at: String
    	sender: Employee!
    	recipient: Employee!
    } // These are attributes every recognition sent or recieved would have
      // (sender and recipient are attributes of employee )

    type Engagement {
    	employee_id: ID!
    	recognition_count: Int!
    } // I have added this to query analytics for team engagement

    type Query {
    	employees: [Employee!]!
    	recognitions: [Recognition!]!
    	recognitionsByTeam: [Recognition]!
    	recognitionsByKeyword: [Recognition]!
    	recognitionEngagementLevels: [Engagement!]!
    }  // These are queries for fetching data


    type Mutation {
    	sendRecognition(
    		senderId: ID!
    		recipientId: ID!
    		message: String!
    		emoji: String
    		visibility: Visibility!
    	): Recognition!
    }  // This is type to send a recognition from an employer

    type NotificationPayload {
    	recipientName: String!
    	senderName: String!
    }  // This is payload to notify recipient when a recognition is sent from any other employer or self

    type Subscription {
    	notifyRecipient: NotificationPayload!
    }  // This is graphql subscription type for Notification service
