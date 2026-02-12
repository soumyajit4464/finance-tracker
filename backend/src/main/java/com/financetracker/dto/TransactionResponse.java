package com.financetracker.dto;

import com.financetracker.model.Transaction;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionResponse {
    
    private Long id;
    private String type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
    private AccountInfo account;
    
    public TransactionResponse() {}
    
    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.type = transaction.getType().name();
        this.amount = transaction.getAmount();
        this.category = transaction.getCategory();
        this.description = transaction.getDescription();
        this.transactionDate = transaction.getTransactionDate();
        this.createdAt = transaction.getCreatedAt();
        
        if (transaction.getAccount() != null) {
            this.account = new AccountInfo();
            this.account.setId(transaction.getAccount().getId());
            this.account.setName(transaction.getAccount().getName());
            this.account.setType(transaction.getAccount().getType().name());
            this.account.setBalance(transaction.getAccount().getBalance());
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public AccountInfo getAccount() {
        return account;
    }
    
    public void setAccount(AccountInfo account) {
        this.account = account;
    }
    
    // Nested class for account information
    public static class AccountInfo {
        private Long id;
        private String name;
        private String type;
        private BigDecimal balance;
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getType() {
            return type;
        }
        
        public void setType(String type) {
            this.type = type;
        }
        
        public BigDecimal getBalance() {
            return balance;
        }
        
        public void setBalance(BigDecimal balance) {
            this.balance = balance;
        }
    }
}