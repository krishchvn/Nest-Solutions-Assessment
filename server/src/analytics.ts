import { db } from './db.ts';

type Engagement = {
	employee_id: number;
	recognition_count: number;
};

type Recognition = {
	id: string;
	message: string;
	sender: { name: string };
	recipient: { name: string };
	visibility: string;
};

export async function getRecognitionsByFrontendTeam() {
	const result = await db.query(`
    SELECT COUNT(rec.id)
	FROM recognitions r
	JOIN employees rec ON r.recipient_id = rec.id
    WHERE rec.team = 'Frontend';
  `);

	const count = result.rows[0].count;
	return count;
}

export async function getRecognitionsByGreatJob() {
	const result = await db.query(`
    SELECT r.*, 
	s.id as s_id , s.name as s_name , s.email as s_email , s.role  as s_role , s.team as s_team , s.created_at as s_createdat ,
	rec.id as rec_id, rec.name as rec_name , rec.email as rec_email , rec.role as rec_role, rec.team as rec_team , rec.created_at as rec_createdat
	FROM recognitions r
	JOIN employees s ON r.sender_id = s.id
	JOIN employees rec ON r.recipient_id = rec.id
    WHERE r.message ILIKE '%Great job%';
  `);

	return result.rows.map((row: any) => ({
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
}

export async function getCountOfRecognitionLevels() {
	const result = await db.query(`
    SELECT id as employee_id, COUNT(*) AS recognition_count
    FROM (
      SELECT sender_id AS id FROM recognitions  WHERE sender_id IS NOT NULL
      UNION ALL
      SELECT recipient_id AS id FROM recognitions WHERE recipient_id IS NOT NULL
    ) AS all_participants 
    GROUP BY id
    ORDER BY recognition_count DESC;
  `);

	return result.rows;
}

// 2. Resolvers

export const analyticsResolvers = {
	Query: {
		recognitionsByTeam: async () => {
			return await getRecognitionsByFrontendTeam();
		},
		recognitionsByKeyword: async () => {
			return await getRecognitionsByGreatJob();
		},
		recognitionEngagementLevels: async () => {
			return await getCountOfRecognitionLevels();
		},
	},
};

export async function fetchRecognitionsByTeam(): Promise<Number> {
	const query = `
    query {
      recognitionsByTeam
    }
  `;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	const result = await response.json();

	if (result.errors) {
		throw new Error(JSON.stringify(result.errors));
	}

	return result.data.recognitionsByTeam;
}

export async function fetchRecognitionsByKeyword(): Promise<Recognition[]> {
	const query = `
    query {
      recognitionsByKeyword  {
        id
        message
        emoji
        visibility
        created_at
        sender {
          id
          name
          email
          role
          team
        }
        recipient {
          id
          name
          email
          role
          team
        }
      }
    }
  `;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	const result = await response.json();

	if (result.errors) {
		throw new Error(JSON.stringify(result.errors));
	}

	return result.data.recognitionsByKeyword;
}

export async function fetchRecognitionEngagementLevels(): Promise<
	Engagement[]
> {
	const query = `
    query {
      recognitionEngagementLevels  {
        employee_id
        recognition_count
      }
    }
  `;

	const response = await fetch('http://localhost:4000/graphql', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	const result = await response.json();

	if (result.errors) {
		throw new Error(
			JSON.stringify(result.errors) || 'Error while getting response'
		);
	}

	return result.data.recognitionEngagementLevels;
}

(async () => {
	try {
		const recognitionsByTeam = await fetchRecognitionsByTeam();
		console.log('recognitionsByTeam:', recognitionsByTeam);

		const recognitionsByKeyword = await fetchRecognitionsByKeyword();
		console.log('Great Job Recognitions:', recognitionsByKeyword);

		const recognitionEngagementLevels =
			await fetchRecognitionEngagementLevels();
		console.log('recognitionEngagementLevels', recognitionEngagementLevels);
	} catch (error) {
		console.error('Error:', error);
	}
})();
