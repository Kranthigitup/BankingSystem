package com.bank.backend.repository;

import com.bank.backend.model.Account;
import com.bank.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByUser(User user);
    Account findByAccountNumber(String accountNumber);
    List<Account> findAllByUser(User user);
}
