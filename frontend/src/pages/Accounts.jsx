import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import accountService from '../services/accountService'

function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'SAVINGS',
    balance: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAllAccounts()
      setAccounts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading accounts:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, formData)
      } else {
        await accountService.createAccount(formData)
      }
      setFormData({ name: '', type: 'SAVINGS', balance: '' })
      setShowForm(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Failed to save account')
    }
  }

  const handleEdit = (account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountService.deleteAccount(id)
        loadAccounts()
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAccount(null)
    setFormData({ name: '', type: 'SAVINGS', balance: '' })
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading accounts...</p>
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
          <h1 style={{ color: '#1f2937', margin: 0 }}>Accounts</h1>
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
            + Add Account
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
              {editingAccount ? 'Edit Account' : 'Add New Account'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Main Checking, Savings, Credit Card"
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
                  Account Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1em'
                  }}
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="INVESTMENT">Investment</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Current Balance (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
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
                  {editingAccount ? 'Update Account' : 'Create Account'}
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

        {/* Accounts List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {accounts.map((account) => (
            <div
              key={account.id}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                  {account.name}
                </h3>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#e0e7ff',
                  color: '#4F46E5',
                  borderRadius: '12px',
                  fontSize: '0.85em',
                  fontWeight: '500'
                }}>
                  {account.type}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '0.9em' }}>
                  Current Balance
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '2em', 
                  fontWeight: '700',
                  color: account.balance >= 0 ? '#10b981' : '#ef4444'
                }}>
                  ₹{account.balance.toLocaleString()}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(account)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9em',
                    fontWeight: '500',
                    color: '#dc2626'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && !showForm && (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2em', color: '#6b7280', margin: 0 }}>
              No accounts yet. Click "Add Account" to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Accounts
