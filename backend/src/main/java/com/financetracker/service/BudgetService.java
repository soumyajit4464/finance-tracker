package com.financetracker.service;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import com.financetracker.model.Budget;
import com.financetracker.model.User;
import com.financetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AuthService authService;

    public List<BudgetResponse> getAllBudgetsForCurrentUser() {
        User currentUser = authService.getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserId(currentUser.getId());
        return budgets.stream()
                .map(BudgetResponse::new)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getBudgetsByMonthAndYear(Integer month, Integer year) {
        User currentUser = authService.getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(currentUser.getId(), month, year);
        return budgets.stream()
                .map(BudgetResponse::new)
                .collect(Collectors.toList());
    }

    public List<BudgetResponse> getCurrentMonthBudgets() {
        LocalDate now = LocalDate.now();
        return getBudgetsByMonthAndYear(now.getMonthValue(), now.getYear());
    }

    public BudgetResponse getBudgetById(Long id) {
        User currentUser = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return new BudgetResponse(budget);
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        User currentUser = authService.getCurrentUser();
        
        // Parse month string (YYYY-MM) to get year and month
        String[] parts = request.getMonth().split("-");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid month format. Expected YYYY-MM");
        }
        
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        
        // Check if budget already exists for this category/month/year
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
            currentUser.getId(), 
            request.getCategory(), 
            month, 
            year
        ).ifPresent(existingBudget -> {
            throw new RuntimeException("Budget already exists for this category in the specified month");
        });
        
        // Create budget entity
        Budget budget = new Budget();
        budget.setCategory(request.getCategory());
        budget.setLimit(request.getAmount());
        budget.setSpent(BigDecimal.ZERO);
        budget.setMonth(month);
        budget.setYear(year);
        budget.setUser(currentUser);
        
        Budget savedBudget = budgetRepository.save(budget);
        return new BudgetResponse(savedBudget);
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        User currentUser = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        // Parse month string (YYYY-MM) to get year and month
        String[] parts = request.getMonth().split("-");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid month format. Expected YYYY-MM");
        }
        
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        
        // Update budget
        budget.setCategory(request.getCategory());
        budget.setLimit(request.getAmount());
        budget.setMonth(month);
        budget.setYear(year);
        
        Budget updatedBudget = budgetRepository.save(budget);
        return new BudgetResponse(updatedBudget);
    }

    public void deleteBudget(Long id) {
        User currentUser = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        budgetRepository.delete(budget);
    }

    public Budget updateSpentAmount(Long id, BigDecimal amount) {
        User currentUser = authService.getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        budget.setSpent(budget.getSpent().add(amount));
        return budgetRepository.save(budget);
    }
}