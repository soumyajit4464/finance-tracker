package com.financetracker.controller;

import com.financetracker.dto.MessageResponse;
import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.model.Transaction;
import com.financetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactionsForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getTransactionsByAccount(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionsByAccount(accountId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.ok(transactionService.createTransaction(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        try {
            return ResponseEntity.ok(transactionService.updateTransaction(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.ok(new MessageResponse("Transaction deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
}