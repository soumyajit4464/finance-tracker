package com.financetracker.controller;

import com.financetracker.dto.MessageResponse;
import com.financetracker.model.Account;
import com.financetracker.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccountsForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(accountService.getAccountById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody Account account) {
        try {
            return ResponseEntity.ok(accountService.createAccount(account));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAccount(@PathVariable Long id, @Valid @RequestBody Account account) {
        try {
            return ResponseEntity.ok(accountService.updateAccount(id, account));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/total-balance")
    public ResponseEntity<Map<String, Object>> getTotalBalance() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalBalance", accountService.getTotalBalance());
        return ResponseEntity.ok(response);
    }
}
