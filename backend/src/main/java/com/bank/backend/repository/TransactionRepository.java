package com.bank.backend.repository;

import com.bank.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccount(String from, String to);
    void deleteByFromAccountOrToAccount(String from, String to);
}
