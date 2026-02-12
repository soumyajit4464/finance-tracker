package com.financetracker.controller;

import com.financetracker.dto.BudgetRequest;
import com.financetracker.dto.BudgetResponse;
import com.financetracker.dto.MessageResponse;
import com.financetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgetsForCurrentUser());
    }

    @GetMapping("/current")
    public ResponseEntity<List<BudgetResponse>> getCurrentMonthBudgets() {
        return ResponseEntity.ok(budgetService.getCurrentMonthBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(budgetService.getBudgetById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/month/{month}/year/{year}")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByMonthAndYear(
            @PathVariable Integer month, 
            @PathVariable Integer year) {
        return ResponseEntity.ok(budgetService.getBudgetsByMonthAndYear(month, year));
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@Valid @RequestBody BudgetRequest request) {
        try {
            return ResponseEntity.ok(budgetService.createBudget(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest request) {
        try {
            return ResponseEntity.ok(budgetService.updateBudget(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        try {
            budgetService.deleteBudget(id);
            return ResponseEntity.ok(new MessageResponse("Budget deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
}