import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import transactionService from '../services/transactionService'
import accountService from '../services/accountService'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    accountId: '',
    type: 'EXPENSE',
    category: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setError(null)
      const [transactionsData, accountsData] = await Promise.all([
        transactionService.getAllTransactions(),
        accountService.getAllAccounts()
      ])
      console.log('Loaded transactions:', transactionsData)
      console.log('Loaded accounts:', accountsData)
      setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
      setAccounts(Array.isArray(accountsData) ? accountsData : [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setError(error.response?.data?.message || error.message || 'Failed to load data')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.id, formData)
      } else {
        await transactionService.createTransaction(formData)
      }
      setFormData({
        accountId: '',
        type: 'EXPENSE',
        category: '',
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0]
      })
      setShowForm(false)
      setEditingTransaction(null)
      loadData()
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction')
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      accountId: transaction.account?.id || '',
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || '',
      transactionDate: transaction.transactionDate
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id)
        loadData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
        alert('Failed to delete transaction')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTransaction(null)
    setFormData({
      accountId: '',
      type: 'EXPENSE',
      category: '',
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0]
    })
  }

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filterType === 'ALL' || t.type === filterType
    const searchMatch = !searchQuery || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return typeMatch && searchMatch
  })

  const categories = {
    EXPENSE: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other'],
    INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Other']
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading transactions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h3 style={{ color: '#dc2626', marginTop: 0 }}>Error Loading Transactions</h3>
            <p style={{ color: '#991b1b' }}>{error}</p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                loadData()
              }}
              style={{
                padding: '10px 20px',
                background: '#4F46E5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      <Navbar />
      
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ color: '#1f2937', margin: 0 }}>Transactions</h1>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 24px',
              background: '#4F46E5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: '500'
            }}
          >
            + Add Transaction
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0 }}>
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Account
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} (₹{account.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1em'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this transaction..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1em',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#4F46E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              placeholder="Search by category or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.95em'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['ALL', 'INCOME', 'EXPENSE'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '10px 20px',
                  background: filterType === type ? '#4F46E5' : '#f3f4f6',
                  color: filterType === type ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontWeight: '500'
                }}
              >
                {type === 'ALL' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1em', color: '#6b7280', margin: 0 }}>
                {searchQuery || filterType !== 'ALL' 
                  ? 'No transactions found matching your filters.' 
                  : 'No transactions yet. Add your first transaction to get started!'}
              </p>
            </div>
          ) : (
            <div>
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 25px',
                    borderBottom: index < filteredTransactions.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75em',
                        fontWeight: '600',
                        background: transaction.type === 'INCOME' ? '#dcfce7' : '#fee2e2',
                        color: transaction.type === 'INCOME' ? '#15803d' : '#dc2626'
                      }}>
                        {transaction.type}
                      </span>
                      <h4 style={{ margin: 0, color: '#1f2937', fontSize: '1.05em' }}>
                        {transaction.category}
                      </h4>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9em', color: '#6b7280' }}>
                      {transaction.description || 'No description'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85em', color: '#9ca3af' }}>
                      {transaction.account?.name || 'Unknown Account'} • {new Date(transaction.transactionDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      fontSize: '1.3em',
                      fontWeight: '700',
                      color: transaction.type === 'INCOME' ? '#10b981' : '#ef4444',
                      minWidth: '120px',
                      textAlign: 'right'
                    }}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(transaction)}
                        style={{
                          padding: '8px 16px',
                          background: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85em',
                          fontWeight: '500',
                          color: '#374151'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85em',
                          fontWeight: '500',
                          color: '#dc2626'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Transactions