CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',

    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
);

COMMENT ON COLUMN users.email IS 'Unique email address, used for login.';

COMMENT ON COLUMN users.password IS 'Hashed user password.';
