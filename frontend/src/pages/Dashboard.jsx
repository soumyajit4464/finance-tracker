import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import accountService from '../services/accountService'
import transactionService from '../services/transactionService'
import budgetService from '../services/budgetService'

function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [accountsData, transactionsData, budgetsData, balanceData] = await Promise.all([
        accountService.getAllAccounts(),
        transactionService.getAllTransactions(),
        budgetService.getCurrentMonthBudgets(),
        accountService.getTotalBalance()
      ])

      setAccounts(accountsData)
      setTransactions(transactionsData.slice(0, 5)) // Show only 5 recent
      setBudgets(budgetsData)
      setTotalBalance(balanceData.totalBalance || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#1f2937', marginBottom: '30px' }}>Dashboard</h1>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard
            title="Total Balance"
            value={`₹${totalBalance.toLocaleString()}`}
            color="#10b981"
          />
          <StatCard
            title="Accounts"
            value={accounts.length}
            color="#3b82f6"
          />
          <StatCard
            title="Transactions"
            value={transactions.length}
            color="#f59e0b"
          />
          <StatCard
            title="Budgets"
            value={budgets.length}
            color="#8b5cf6"
          />
        </div>

        {/* Recent Transactions */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No transactions yet. Create your first account and start tracking!</p>
          ) : (
            <div>
              {transactions.map((transaction) => (
                <div key={transaction.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{transaction.category}</h4>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#6b7280' }}>
                      {transaction.description || 'No description'}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '1.1em',
                    fontWeight: '600',
                    color: transaction.type === 'INCOME' ? '#10b981' : '#ef4444'
                  }}>
                    {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accounts Overview */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>Accounts</h2>
          
          {accounts.length === 0 ? (
            <p style={{ color: '#6b7280' }}>
              No accounts yet.{' '}
              <a href="/accounts" style={{ color: '#4F46E5' }}>Create your first account</a>
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {accounts.map((account) => (
                <div key={account.id} style={{
                  padding: '20px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>{account.name}</h4>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9em', color: '#6b7280' }}>
                    {account.type}
                  </p>
                  <p style={{ margin: 0, fontSize: '1.3em', fontWeight: '600', color: '#4F46E5' }}>
                    ₹{account.balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '0.9em' }}>{title}</p>
      <h2 style={{ margin: 0, color: color, fontSize: '2em' }}>{value}</h2>
    </div>
  )
}

export default Dashboard
