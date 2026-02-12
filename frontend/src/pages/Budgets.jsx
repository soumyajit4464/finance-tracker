import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import budgetService from '../services/budgetService'

function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    try {
      const data = await budgetService.getCurrentMonthBudgets()
      setBudgets(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading budgets:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, formData)
      } else {
        await budgetService.createBudget(formData)
      }
      setFormData({
        category: '',
        amount: '',
        month: new Date().toISOString().slice(0, 7)
      })
      setShowForm(false)
      setEditingBudget(null)
      loadBudgets()
    } catch (error) {
      console.error('Error saving budget:', error)
      alert('Failed to save budget')
    }
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.deleteBudget(id)
        loadBudgets()
      } catch (error) {
        console.error('Error deleting budget:', error)
        alert('Failed to delete budget')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBudget(null)
    setFormData({
      category: '',
      amount: '',
      month: new Date().toISOString().slice(0, 7)
    })
  }

  const getProgressPercentage = (spent, budgetAmount) => {
    return Math.min((spent / budgetAmount) * 100, 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#ef4444' // Red
    if (percentage >= 70) return '#f59e0b' // Orange
    return '#10b981' // Green
  }

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Other'
  ]

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading budgets...</p>
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
          <h1 style={{ color: '#1f2937', margin: 0 }}>Monthly Budgets</h1>
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
            + Add Budget
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
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
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
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Budget Amount (₹)
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

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    Month
                  </label>
                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
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
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
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

        {/* Summary Card */}
        {budgets.length > 0 && (
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
              {new Date(budgets[0].month + '-01').toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })} Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '0.9em' }}>
                  Total Budget
                </p>
                <p style={{ margin: 0, fontSize: '1.8em', fontWeight: '700', color: '#4F46E5' }}>
                  ₹{budgets.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '0.9em' }}>
                  Total Spent
                </p>
                <p style={{ margin: 0, fontSize: '1.8em', fontWeight: '700', color: '#ef4444' }}>
                  ₹{budgets.reduce((sum, b) => sum + b.spent, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#6b7280', fontSize: '0.9em' }}>
                  Remaining
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1.8em', 
                  fontWeight: '700', 
                  color: budgets.reduce((sum, b) => sum + (b.amount - b.spent), 0) >= 0 ? '#10b981' : '#ef4444'
                }}>
                  ₹{budgets.reduce((sum, b) => sum + (b.amount - b.spent), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Budgets List */}
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {budgets.map((budget) => {
            const percentage = getProgressPercentage(budget.spent, budget.amount)
            const progressColor = getProgressColor(percentage)
            const remaining = budget.amount - budget.spent

            return (
              <div
                key={budget.id}
                style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.3em' }}>
                      {budget.category}
                    </h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9em' }}>
                      {new Date(budget.month + '-01').toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(budget)}
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
                      onClick={() => handleDelete(budget.id)}
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

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '0.9em', color: '#6b7280' }}>
                      ₹{budget.spent.toLocaleString()} spent
                    </span>
                    <span style={{ fontSize: '0.9em', color: '#6b7280' }}>
                      ₹{budget.amount.toLocaleString()} budget
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: progressColor,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '15px',
                  padding: '15px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.85em', color: '#6b7280' }}>
                      Remaining
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '1.2em', 
                      fontWeight: '600',
                      color: remaining >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      ₹{Math.abs(remaining).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.85em', color: '#6b7280' }}>
                      Used
                    </p>
                    <p style={{ margin: 0, fontSize: '1.2em', fontWeight: '600', color: '#374151' }}>
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.85em', color: '#6b7280' }}>
                      Status
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '0.85em', 
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      background: percentage >= 90 ? '#fee2e2' : percentage >= 70 ? '#fef3c7' : '#dcfce7',
                      color: percentage >= 90 ? '#dc2626' : percentage >= 70 ? '#d97706' : '#15803d'
                    }}>
                      {percentage >= 90 ? 'Over Budget' : percentage >= 70 ? 'Warning' : 'On Track'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {budgets.length === 0 && !showForm && (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.2em', color: '#6b7280', margin: 0 }}>
              No budgets set yet. Click "Add Budget" to start tracking your spending!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Budgets
