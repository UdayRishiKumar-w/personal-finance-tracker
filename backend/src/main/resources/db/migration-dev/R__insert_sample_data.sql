MERGE INTO
    users AS u USING (
    VALUES
    (
        'admin@example.com',
        'System',
        'Administrator',
        -- This is BCrypt hash of password "Admin@1234" - example
        '$2a$11$zEEkxR5wf7Qw67.lOBCBiebtn998YGS2f95rpfIon8nJa8qSO4j9S',
        'ADMIN',
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000,
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000
    )
) AS vals (
    email,
    first_name,
    last_name,
    password,
    role,
    created_at,
    updated_at
) ON u.email = vals.email
WHEN NOT MATCHED THEN
    INSERT
        (
            email,
            first_name,
            last_name,
            password,
            role,
            created_at,
            updated_at
        )
    VALUES
    (
        vals.email,
        vals.first_name,
        vals.last_name,
        vals.password,
        vals.role,
        vals.created_at,
        vals.updated_at
    );

-- Inserting a regular test user
MERGE INTO
    users AS u USING (
    VALUES
    (
        'user@example.com',
        'John',
        'Doe',
        -- This is BCrypt hash of password "User@12345"
        '$2a$11$Hxg0Dwn4YooTVR9NvhBlwuyWU0yg55gE0qnrNsQPXYJ2bBxl0Eivi',
        'USER',
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000,
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000
    )
) AS vals (
    email,
    first_name,
    last_name,
    password,
    role,
    created_at,
    updated_at
) ON u.email = vals.email
WHEN NOT MATCHED THEN
    INSERT
        (
            email,
            first_name,
            last_name,
            password,
            role,
            created_at,
            updated_at
        )
    VALUES
    (
        vals.email,
        vals.first_name,
        vals.last_name,
        vals.password,
        vals.role,
        vals.created_at,
        vals.updated_at
    );

-- Inserting a refresh token for admin
MERGE INTO
    refresh_tokens AS rt USING (
    SELECT id AS user_id
    FROM
        users
    WHERE
        email = 'admin@example.com'
) AS u ON rt.user_id = u.user_id
WHEN NOT MATCHED THEN
    INSERT
        (user_id, token, expiry_date, updated_at)
    VALUES
    (
        u.user_id,
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTc2MjcwNjc5NSwiZXhwIjoxNzYzMzExNTk1fQ.fNzycM3QQbXBZIaHe03LthfmVwc5ALiGOnHCg3-ZBa6N4lo4X3ZfaK59UAqKynMch4N-YXb5lDaY0g_TJSZsqg',
        DATEADD('DAY', 7, CURRENT_TIMESTAMP),
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000
    );

-- Inserting a refresh token for user
MERGE INTO
    refresh_tokens AS rt USING (
    SELECT id AS user_id
    FROM
        users
    WHERE
        email = 'user@example.com'
) AS u ON rt.user_id = u.user_id
WHEN NOT MATCHED THEN
    INSERT
        (user_id, token, expiry_date, updated_at)
    VALUES
    (
        u.user_id,
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzYyNzA3MDcwLCJleHAiOjE3NjMzMTE4NzB9.F2qJpiCSvz4UJOUItij5hsHG-m3I1NHAkEzFbdQKi8PbTvTMYSYhEtFgOUDrgffIoeZjr8aoDXYWtU1BxQl1rw',
        DATEADD('DAY', 7, CURRENT_TIMESTAMP),
        EXTRACT(
            EPOCH
            FROM
            CURRENT_TIMESTAMP
        ) * 1000
    );

-- Inserting some sample transactions for test user
MERGE INTO
    transactions AS t USING (
    SELECT id AS user_id
    FROM
        users
    WHERE
        email = 'user@example.com'
) AS u
    ON
        t.user_id = u.user_id
        AND t.title = 'Monthly Rent'
WHEN NOT MATCHED THEN
    INSERT
        (
            user_id,
            title,
            amount,
            category,
            date,
            type,
            description,
            recurring
        )
    VALUES
    (
        u.user_id,
        'Monthly Rent',
        1200.00,
        'Housing',
        CURRENT_DATE - 10,
        'EXPENSE',
        'Paid monthly apartment rent',
        FALSE
    );

MERGE INTO
    transactions AS t USING (
    SELECT id AS user_id
    FROM
        users
    WHERE
        email = 'user@example.com'
) AS u
    ON
        t.user_id = u.user_id
        AND t.title = 'Salary Payment'
WHEN NOT MATCHED THEN
    INSERT
        (
            user_id,
            title,
            amount,
            category,
            date,
            type,
            description,
            recurring
        )
    VALUES
    (
        u.user_id,
        'Salary Payment',
        3500.00,
        'Income',
        CURRENT_DATE - 9,
        'INCOME',
        'Received monthly salary from employer',
        FALSE
    );
