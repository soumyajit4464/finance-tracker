package com.financetracker.dto;

import com.financetracker.model.Budget;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BudgetResponse {
    
    private Long id;
    private String category;
    private BigDecimal amount;  // This is the budget limit
    private BigDecimal spent;
    private String month;  // Format: YYYY-MM
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public BudgetResponse() {}
    
    public BudgetResponse(Budget budget) {
        this.id = budget.getId();
        this.category = budget.getCategory();
        this.amount = budget.getLimit();
        this.spent = budget.getSpent();
        // Convert month and year integers to YYYY-MM format
        this.month = String.format("%04d-%02d", budget.getYear(), budget.getMonth());
        this.createdAt = budget.getCreatedAt();
        this.updatedAt = budget.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public BigDecimal getSpent() {
        return spent;
    }
    
    public void setSpent(BigDecimal spent) {
        this.spent = spent;
    }
    
    public String getMonth() {
        return month;
    }
    
    public void setMonth(String month) {
        this.month = month;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}