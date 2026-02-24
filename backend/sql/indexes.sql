-- Suggested indexes for performance (apply manually in your DB)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_from_account ON transactions(from_account);
CREATE INDEX idx_transactions_to_account ON transactions(to_account);
CREATE INDEX idx_transactions_date ON transactions(date);
