CREATE TABLE transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    category VARCHAR(255),
    date DATE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    recurring BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT pk_transactions PRIMARY KEY (id),
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users (
        id
    ) ON DELETE CASCADE,
    CONSTRAINT chk_transactions_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_transactions_type_valid CHECK (type IN ('INCOME', 'EXPENSE'))
);

COMMENT ON TABLE transactions IS 'Tracks user financial transactions (income and expenses).';

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_refresh_token_user_id ON refresh_tokens (user_id);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);

CREATE INDEX idx_transactions_user_id ON transactions (user_id);

CREATE INDEX idx_transactions_date ON transactions (date);
