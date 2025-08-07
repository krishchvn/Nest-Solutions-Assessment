## Nest solutions Assessment

### Installation:

    1. Whip out all directories from zip file and go to server/ and
    run `npm install`.
    2. If you already have pgAdmin/PostgreSQL/PSQL server installed, open it and make sure you
    type out all field exactly as below
        host: 'localhost'
        port: 5432
        user: 'postgres'
        password: 'postgres'
        database: 'postgres'
    (If you do not have it installed, you can install it from
     `https://www.postgresql.org/download/`)

    3. Go to psql terminal and run sql queries in all.txt. This will populate your database
    4. Go to server/src/ and run `npx ts-node index.ts`. This will start GraphQL server at port 4000.
    5. Next, navigate to `https://studio.apollographql.com/sandbox/explorer` to play with fields
    and API `https://localhost:4000/graphql`
    6. You can run analytics.ts and query.ts using command `npx ts-node query.ts` or replace
    'query' with 'analytics'.

#### To check examples of running code, after following these steps, please run analytics.ts to check examples of analytics and run query.ts to check GET queries, and POST, DELETE mutations

### Thought Process:

    Important Outcomes:
    1. Recognition creation with messages and emojis
    2. Real Time Notifications and updates
    3. Visibility Control
    4. Analytics
    5. Role Based Access Control
    6. Extensibility, and Integration

    To configure API endpoints and data, we need to create two tables
    (Please see Queries.md for reasoning of relational database/PostgresSQL for database purpose)

    1. Employees -> holds employee data including Roles (EMPLOYEE, MANAGER, TEAMLEAD) for RBAC purposes
    2. Recognitions -> holds attributes necessary for recognition such as message, emojis,
    sender info, receiver info, and visibility for Visibility control.

    For extensibility, this is a great database because
    For example:
    1.Reactions: We can add references and foreign keys of employees and recognition tables
    to reaction table
    It can look something like
    reactions (
        id SERIAL PRIMARY KEY,
        recognition_id INT REFERENCES recognitions(id),
        reactor_id INT REFERENCES employees(id),
        emoji TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
    )

    2. Similarly for Likes and Comments,
    comments (
        id SERIAL PRIMARY KEY,
        recognition_id INT REFERENCES recognitions(id),
        author_id INT REFERENCES employees(id),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
    )

    likes (
        id SERIAL PRIMARY KEY,
        recognition_id INT REFERENCES recognitions(id) ON DELETE CASCADE,
        liked_by INT REFERENCES employees(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now(),
    )

    For Integration, we could use webhooks or call APIs that fetch data from tables and display
    on frontend.

    (More info about Access Control and Visibility is shared in AccessControlAndVisibility.md)
    (More info on Analytics is shared in Queries.md)
    (More info on Real Time Notifications is shared in Subscriptions.md)
