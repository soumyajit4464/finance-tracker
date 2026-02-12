package com.financetracker.service;

import com.financetracker.dto.TransactionRequest;
import com.financetracker.dto.TransactionResponse;
import com.financetracker.model.Account;
import com.financetracker.model.Budget;
import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.AccountRepository;
import com.financetracker.repository.BudgetRepository;
import com.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private AuthService authService;

    public List<TransactionResponse> getAllTransactionsForCurrentUser() {
        User currentUser = authService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(currentUser.getId());
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        User currentUser = authService.getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(currentUser.getId(), startDate, endDate);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByAccount(Long accountId) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
        return transactions.stream()
                .map(TransactionResponse::new)
                .collect(Collectors.toList());
    }

    public TransactionResponse getTransactionById(Long id) {
        User currentUser = authService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getAccount().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return new TransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Create transaction entity
        Transaction transaction = new Transaction();
        transaction.setType(Transaction.TransactionType.valueOf(request.getType()));
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate() != null ? 
            request.getTransactionDate() : LocalDate.now());
        transaction.setAccount(account);

        // Update account balance
        if (transaction.getType() == Transaction.TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
        } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        }

        accountRepository.save(account);
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update budget if it's an expense
        if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            updateBudgetSpent(currentUser.getId(), transaction.getCategory(), 
                transaction.getTransactionDate(), transaction.getAmount());
        }
        
        return new TransactionResponse(savedTransaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        // Get the original transaction using the internal method
        User currentUser = authService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getAccount().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        Account oldAccount = transaction.getAccount();
        
        // Store old transaction details for budget reversal
        Transaction.TransactionType oldType = transaction.getType();
        String oldCategory = transaction.getCategory();
        BigDecimal oldAmount = transaction.getAmount();
        LocalDate oldDate = transaction.getTransactionDate();

        // Reverse old transaction from old account
        if (transaction.getType() == Transaction.TransactionType.INCOME) {
            oldAccount.setBalance(oldAccount.getBalance().subtract(transaction.getAmount()));
        } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            oldAccount.setBalance(oldAccount.getBalance().add(transaction.getAmount()));
        }
        
        // Reverse old budget update if it was an expense
        if (oldType == Transaction.TransactionType.EXPENSE) {
            updateBudgetSpent(currentUser.getId(), oldCategory, oldDate, oldAmount.negate());
        }

        // Get new account (might be the same as old account)
        Account newAccount = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!newAccount.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }

        // Update transaction
        transaction.setType(Transaction.TransactionType.valueOf(request.getType()));
        transaction.setAmount(request.getAmount());
        transaction.setCategory(request.getCategory());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setAccount(newAccount);

        // Apply new transaction to new account
        if (transaction.getType() == Transaction.TransactionType.INCOME) {
            newAccount.setBalance(newAccount.getBalance().add(transaction.getAmount()));
        } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            newAccount.setBalance(newAccount.getBalance().subtract(transaction.getAmount()));
        }

        accountRepository.save(oldAccount);
        if (!oldAccount.getId().equals(newAccount.getId())) {
            accountRepository.save(newAccount);
        }
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        
        // Update budget if new transaction is an expense
        if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            updateBudgetSpent(currentUser.getId(), transaction.getCategory(), 
                transaction.getTransactionDate(), transaction.getAmount());
        }
        
        return new TransactionResponse(updatedTransaction);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        User currentUser = authService.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getAccount().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        Account account = transaction.getAccount();

        // Reverse transaction
        if (transaction.getType() == Transaction.TransactionType.INCOME) {
            account.setBalance(account.getBalance().subtract(transaction.getAmount()));
        } else if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
            account.setBalance(account.getBalance().add(transaction.getAmount()));
            // Reverse budget spent
            updateBudgetSpent(currentUser.getId(), transaction.getCategory(), 
                transaction.getTransactionDate(), transaction.getAmount().negate());
        }

        accountRepository.save(account);
        transactionRepository.delete(transaction);
    }
    
    /**
     * Helper method to update budget spent amount when a transaction is created, updated, or deleted
     * @param userId The user ID
     * @param category The transaction category
     * @param transactionDate The transaction date
     * @param amount The amount to add to spent (use negative to subtract)
     */
    private void updateBudgetSpent(Long userId, String category, LocalDate transactionDate, BigDecimal amount) {
        int month = transactionDate.getMonthValue();
        int year = transactionDate.getYear();
        
        Optional<Budget> budgetOptional = budgetRepository.findByUserIdAndCategoryAndMonthAndYear(
            userId, category, month, year
        );
        
        if (budgetOptional.isPresent()) {
            Budget budget = budgetOptional.get();
            budget.setSpent(budget.getSpent().add(amount));
            // Ensure spent doesn't go below zero
            if (budget.getSpent().compareTo(BigDecimal.ZERO) < 0) {
                budget.setSpent(BigDecimal.ZERO);
            }
            budgetRepository.save(budget);
        }
        // If no budget exists for this category/month, silently skip (don't create one)
    }
}