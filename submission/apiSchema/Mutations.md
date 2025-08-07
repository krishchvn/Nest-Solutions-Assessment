## Mutations

### (server/src/resolvers.ts, query.ts)

### 1. Send Recognitions

    I have written a function which sends a recognition from an employee to same or another employee.
    It takes sender_id, recipient_id, message, emoji and visibility as hard coded arguments for now
    but after creating a frontend or integrating with Slack or Microsoft teams, we can
    pass tokens that fill those arguments


    We can also create similar mutations and functions for comments, badges, likes, reactions, etc
    with minimal number of changes. We need to create similar tables for each and write changes to
    the table with very similar queries as below.


    I have assumed that there will not be a large amount of transactions and current transactions to the
    postgres database do not conflict nor disturb ACID properties


    However, if they do, we can use SQS (simple queue service) or any framework that batches the requests
    and apply every 10 mins as per the requirements


    Also, BEGIN.... COMMIT is a good practice that can be implemented. We can use indexes for faster fetching
    of rows. I can also suggest switching to AWS RDS is a good choice with either serverless or EC2 instances.


    Below is the SQL query that sends the recognitions for us


    INSERT INTO recognitions (sender_id, recipient_id, message, emoji, visibility)
    VALUES (sender_id, recipient_id, message, emoji, visibility);

### 2. Delete Recognitions

    As per role based access control defined in AccessControlAndVisibility.md,
    only manager and HR_Admin should be able to delete any recognition,
    otherwise everyone can delete only their own recognitions.

    I have implemented it in deleteRecognitionsById() function, which takes
    three arguments,
    1. Recognition ID (which can be fetched by frontend)
    2. Current UserId (which can be fetched by logging info)
    3. Current UserRole (which can be fetched by logging info or can be fetched from db)

    and then after applying below condition we are able to acheive rbac
    currentUserRole === 'MANAGER' || currentUserRole === 'HR_ADMIN' || (currentUserRole ===
    'EMPLOYEE' && isOwner) || (currentUserRole === 'TEAMLEAD' && isOwner)
    as per our access model.

    I use below sql query to execute delete operation
    DELETE FROM recognitions WHERE id = recognition_id;
