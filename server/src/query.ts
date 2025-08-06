import notifyRecipient from './helper-functions.ts';

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
