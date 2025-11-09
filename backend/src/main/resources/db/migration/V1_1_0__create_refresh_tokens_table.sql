CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL,
    expiry_date TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    updated_at BIGINT,

    CONSTRAINT pk_refresh_tokens PRIMARY KEY (id),
    CONSTRAINT uq_refresh_tokens_user_id UNIQUE (user_id),
    CONSTRAINT uq_refresh_tokens_token UNIQUE (token),
    CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
);

COMMENT ON TABLE refresh_tokens IS 'Stores refresh tokens for user authentication.';
