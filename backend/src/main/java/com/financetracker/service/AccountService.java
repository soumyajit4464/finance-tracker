package com.financetracker.service;

import com.financetracker.model.Account;
import com.financetracker.model.User;
import com.financetracker.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AuthService authService;

    public List<Account> getAllAccountsForCurrentUser() {
        User currentUser = authService.getCurrentUser();
        return accountRepository.findByUserId(currentUser.getId());
    }

    public Account getAccountById(Long id) {
        User currentUser = authService.getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return account;
    }

    public Account createAccount(Account account) {
        User currentUser = authService.getCurrentUser();
        account.setUser(currentUser);
        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }
        return accountRepository.save(account);
    }

    public Account updateAccount(Long id, Account accountDetails) {
        Account account = getAccountById(id);
        account.setName(accountDetails.getName());
        account.setType(accountDetails.getType());
        account.setBalance(accountDetails.getBalance());
        account.setCurrency(accountDetails.getCurrency());
        return accountRepository.save(account);
    }

    public void deleteAccount(Long id) {
        Account account = getAccountById(id);
        accountRepository.delete(account);
    }

    public BigDecimal getTotalBalance() {
        User currentUser = authService.getCurrentUser();
        List<Account> accounts = accountRepository.findByUserId(currentUser.getId());
        return accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
