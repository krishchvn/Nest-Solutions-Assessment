import notifyRecipient from './helper-functions.ts';
import { db } from './db.ts';

type Employee = {
	id: string;
	name: string;
	email: string;
	role: string;
	team?: string;
};

type Recognition = {
	id: string;
	message: string;
	sender: { name: string };
	recipient: { name: string };
	visibility: string;
};

async function fetchEmployees(): Promise<Employee[]> {
	const query = `
    query {
      employees {
        id
        name
        email
        role
        team
      }
    }
  `;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	const result = (await response.json()) as {
		data: { employees: Employee[] };
		errors?: any;
	};

	if (result.errors) {
		throw new Error(JSON.stringify(result.errors));
	}

	return result.data.employees;
}

async function fetchAllRecognitions(): Promise<Recognition[]> {
	const query = `
    query {
		recognitions {
		message
		emoji
		recipient {
			created_at
			email
			id
			name
		}
		created_at
		id
		visibility
		sender {
			created_at
			email
			id
			name
			role
			team
    }}}`;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	const result = (await response.json()) as {
		data: { recognitions: Recognition[] };
		errors?: any;
	};

	if (result.errors) {
		throw new Error(JSON.stringify(result.errors));
	}

	return result.data.recognitions;
}

async function sendRecognition(): Promise<Recognition> {
	const mutation = `
    mutation {
      sendRecognition(
        senderId: 2,
        recipientId: 1,
        message: "Congo",
        visibility: PUBLIC
		emoji: ":)"
      ) {
        id
        message
        sender {
          name
        }
        recipient {
          name
        }
      }
    }
  `;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: mutation }),
	});

	const result = (await response.json()) as {
		data: { sendRecognition: Recognition };
		errors?: any;
	};

	if (result.errors) {
		throw new Error(JSON.stringify(result.errors));
	}
	notifyRecipient(
		result.data.sendRecognition.recipient.name,
		result.data.sendRecognition.sender.name
	);

	return result.data.sendRecognition;
}

export async function deleteRecognitionById(
	id: number,
	currentUserId: number,
	currentUserRole: string
): Promise<{ success: boolean; message: string }> {
	const result = await db.query(
		`SELECT sender_id FROM recognitions WHERE id = $1`,
		[id]
	);

	if (result.rows.length === 0) {
		return { success: false, message: 'Recognition not found' };
	}

	const { sender_id } = result.rows[0];
	const isOwner = sender_id === currentUserId;

	const canDelete =
		currentUserRole === 'MANAGER' ||
		currentUserRole === 'HR_ADMIN' ||
		(currentUserRole === 'EMPLOYEE' && isOwner) ||
		(currentUserRole === 'TEAMLEAD' && isOwner);

	if (!canDelete) {
		return {
			success: false,
			message: 'Not authorized to delete this recognition',
		};
	}

	await db.query(`DELETE FROM recognitions WHERE id = $1`, [id]);

	return { success: true, message: 'Recognition deleted successfully' };
}

(async () => {
	try {
		const employees = await fetchEmployees();
		console.log('Employees:', employees);

		const recognitions = await fetchAllRecognitions();
		console.log('All Recognitions:', recognitions);

		const send_recognition = await sendRecognition();
		console.log('Recognition sent:', send_recognition);
	} catch (error) {
		console.error('Error:', error);
	}
})();

// Before running this code, please make sure you have proper arguments in deleteRecognitionById()
// Currently, I have added arguments such that this should work, but only 1 time.
// This deletes a recognition record permanently.

(async () => {
	try {
		// This acts like owner is manager and can delete any record
		const delete_recognition = await deleteRecognitionById(2, 1, 'MANAGER');
		console.log('Recognition sent:', delete_recognition);

		// This acts like self recognition delete
		const delete_recognition_2 = await deleteRecognitionById(3, 3, 'TEAMLEAD');
		console.log('Recognition sent:', delete_recognition_2);
	} catch (error) {
		console.error('Error:', error);
	}
})();
