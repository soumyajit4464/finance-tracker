import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import transactionService from '../services/transactionService'
import budgetService from '../services/budgetService'
import accountService from '../services/accountService'

function Reports() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('THIS_MONTH')

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      const [transactionsData, budgetsData, balanceData] = await Promise.all([
        transactionService.getAllTransactions(),
        budgetService.getCurrentMonthBudgets(),
        accountService.getTotalBalance()
      ])
      setTransactions(transactionsData)
      setBudgets(budgetsData)
      setTotalBalance(balanceData.totalBalance || 0)
      setLoading(false)
    } catch (error) {
      console.error('Error loading report data:', error)
      setLoading(false)
    }
  }

  const filterTransactionsByRange = () => {
    const now = new Date()
    return transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate)
      
      switch (timeRange) {
        case 'THIS_MONTH':
          return transactionDate.getMonth() === now.getMonth() &&
                 transactionDate.getFullYear() === now.getFullYear()
        case 'LAST_MONTH':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          return transactionDate.getMonth() === lastMonth.getMonth() &&
                 transactionDate.getFullYear() === lastMonth.getFullYear()
        case 'LAST_3_MONTHS':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          return transactionDate >= threeMonthsAgo
        case 'THIS_YEAR':
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  const calculateStats = () => {
    const filtered = filterTransactionsByRange()
    const income = filtered
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = filtered
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return { income, expenses, netIncome: income - expenses }
  }

  const getCategoryBreakdown = () => {
    const filtered = filterTransactionsByRange()
    const categoryMap = {}
    
    filtered
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        if (categoryMap[t.category]) {
          categoryMap[t.category] += t.amount
        } else {
          categoryMap[t.category] = t.amount
        }
      })
    
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  const getIncomeBreakdown = () => {
    const filtered = filterTransactionsByRange()
    const categoryMap = {}
    
    filtered
      .filter(t => t.type === 'INCOME')
      .forEach(t => {
        if (categoryMap[t.category]) {
          categoryMap[t.category] += t.amount
        } else {
          categoryMap[t.category] = t.amount
        }
      })
    
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading reports...</p>
        </div>
      </div>
    )
  }

  const stats = calculateStats()
  const expenseBreakdown = getCategoryBreakdown()
  const incomeBreakdown = getIncomeBreakdown()
  const totalExpenses = expenseBreakdown.reduce((sum, cat) => sum + cat.amount, 0)
  const totalIncome = incomeBreakdown.reduce((sum, cat) => sum + cat.amount, 0)

  const categoryColors = {
    'Food': '#ef4444',
    'Transport': '#f59e0b',
    'Shopping': '#ec4899',
    'Bills': '#8b5cf6',
    'Entertainment': '#06b6d4',
    'Healthcare': '#10b981',
    'Education': '#3b82f6',
    'Salary': '#22c55e',
    'Freelance': '#06b6d4',
    'Investment': '#8b5cf6',
    'Gift': '#ec4899',
    'Refund': '#f59e0b',
    'Other': '#6b7280'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ color: '#1f2937', margin: 0 }}>Financial Reports</h1>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '12px 20px',
              border: '1px solid #d1d1db',
              borderRadius: '8px',
              fontSize: '1em',
              background: '#4F46E5',
              cursor: 'pointer'
            }}
          >
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_MONTH">Last Month</option>
            <option value="LAST_3_MONTHS">Last 3 Months</option>
            <option value="THIS_YEAR">This Year</option>
            <option value="ALL_TIME">All Time</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <MetricCard
            title="Total Income"
            value={`₹${stats.income.toLocaleString()}`}
            color="#10b981"
            icon="↑"
          />
          <MetricCard
            title="Total Expenses"
            value={`₹${stats.expenses.toLocaleString()}`}
            color="#ef4444"
            icon="↓"
          />
          <MetricCard
            title="Net Income"
            value={`₹${stats.netIncome.toLocaleString()}`}
            color={stats.netIncome >= 0 ? '#10b981' : '#ef4444'}
            icon={stats.netIncome >= 0 ? "+" : "-"}
          />
          <MetricCard
            title="Current Balance"
            value={`₹${totalBalance.toLocaleString()}`}
            color="#4F46E5"
            icon="₹"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* Expense Breakdown */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>Expense Breakdown</h2>
            
            {expenseBreakdown.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
                No expenses in this period
              </p>
            ) : (
              <div>
                {expenseBreakdown.map((cat) => {
                  const percentage = (cat.amount / totalExpenses) * 100
                  return (
                    <div key={cat.category} style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontWeight: '500', 
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            background: categoryColors[cat.category] || '#6b7280',
                            display: 'inline-block'
                          }} />
                          {cat.category}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          ₹{cat.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: categoryColors[cat.category] || '#6b7280',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Income Breakdown */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>Income Breakdown</h2>
            
            {incomeBreakdown.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
                No income in this period
              </p>
            ) : (
              <div>
                {incomeBreakdown.map((cat) => {
                  const percentage = (cat.amount / totalIncome) * 100
                  return (
                    <div key={cat.category} style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontWeight: '500', 
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            background: categoryColors[cat.category] || '#6b7280',
                            display: 'inline-block'
                          }} />
                          {cat.category}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          ₹{cat.amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: categoryColors[cat.category] || '#6b7280',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Budget Performance */}
        {budgets.length > 0 && (
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>Budget Performance</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.amount) * 100
                const status = percentage >= 90 ? 'Over' : percentage >= 70 ? 'Warning' : 'Good'
                const statusColor = percentage >= 90 ? '#ef4444' : percentage >= 70 ? '#f59e0b' : '#10b981'
                
                return (
                  <div
                    key={budget.id}
                    style={{
                      padding: '20px',
                      background: '#f9fafb',
                      border: `2px solid ${statusColor}`,
                      borderRadius: '8px'
                    }}
                  >
                    <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
                      {budget.category}
                    </h4>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: '100%',
                        background: statusColor,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      <p style={{ margin: '0 0 4px 0' }}>
                        Spent: ₹{budget.spent.toLocaleString()}
                      </p>
                      <p style={{ margin: '0 0 4px 0' }}>
                        Budget: ₹{budget.amount.toLocaleString()}
                      </p>
                      <p style={{ 
                        margin: 0, 
                        fontWeight: '600',
                        color: statusColor
                      }}>
                        {percentage.toFixed(0)}% used • {status}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2em', color: '#6b7280', margin: 0 }}>
              No transaction data available yet. Start adding transactions to see your financial reports!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, color, icon }) {
  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(134, 46, 46, 0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'start',
        marginBottom: '10px'
      }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9em' }}>{title}</p>
        <span style={{ 
          fontSize: '1.5em', 
          color: color,
          fontWeight: '700'
        }}>
          {icon}
        </span>
      </div>
      <h2 style={{ margin: 0, color: color, fontSize: '2em', fontWeight: '700' }}>
        {value}
      </h2>
    </div>
  )
}

export default Reports
