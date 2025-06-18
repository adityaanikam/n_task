import { useState, useEffect } from 'react';
import { apiService, Group } from '../services/api';

interface SplitInput {
  user_id: number;
  percentage?: number;
}

export default function AddExpense() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<number | null>(null);
  const [splitType, setSplitType] = useState<'equal' | 'percentage'>('equal');
  const [splits, setSplits] = useState<SplitInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Fetch all groups
    setLoadingGroups(true);
    console.log('Fetching groups...');
    apiService.getGroups()
      .then(response => {
        console.log('Groups response:', response);
        if (response && response.data) {
          setGroups(response.data);
          setDebugInfo(`Found ${response.data.length} groups`);
        } else {
          setDebugInfo('Response or response.data is undefined');
        }
      })
      .catch(err => {
        console.error("Failed to fetch groups:", err);
        setDebugInfo(`Error: ${err.message}`);
      })
      .finally(() => {
        setLoadingGroups(false);
      });
  }, []);

  useEffect(() => {
    if (groupId) {
      apiService.getGroup(groupId)
        .then(response => {
          const group = response.data;
          setUsers(group.members.map((u) => ({ id: u.id, name: u.name })));
          setPaidBy(group.members[0]?.id || null);
          setSplits(group.members.map((u) => ({ user_id: u.id, percentage: 0 })));
        })
        .catch(err => {
          console.error("Failed to fetch group details:", err);
        });
    }
  }, [groupId]);

  const handleSplitChange = (idx: number, value: number) => {
    setSplits((prev) => prev.map((s, i) => (i === idx ? { ...s, percentage: value } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      if (!groupId || !paidBy || !description || !amount) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      let splitPayload = splits;
      if (splitType === 'equal') {
        splitPayload = [];
      } else {
        const total = splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
        if (total !== 100) {
          setError('Percentages must sum to 100.');
          setLoading(false);
          return;
        }
      }
      await apiService.createExpense(groupId, {
        amount: parseFloat(amount),
        description,
        paid_by: paidBy,
        split_type: splitType,
        splits: splitPayload,
      });
      setSuccess('Expense added successfully!');
      setDescription('');
      setAmount('');
      setSplits(users.map((u) => ({ user_id: u.id, percentage: 0 })));
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        marginBottom: '24px', 
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif'
      }}>
        Add Expense
      </h2>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        {debugInfo && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#f0f9ff',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#0369a1'
          }}>
            Debug: {debugInfo}
          </div>
        )}
        
        {loadingGroups ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="loading-spinner"></div>
            <span style={{ marginLeft: '12px', color: '#6b7280' }}>Loading groups...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Group
              </label>
              <select
                value={groupId || ''}
                onChange={e => setGroupId(Number(e.target.value))}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease-in-out',
                }}
                onFocus={e => e.target.style.borderColor = '#7C3AED'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="">Select group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {groups.length === 0 && (
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '14px', 
                  marginTop: '8px' 
                }}>
                  No groups found. Please create a group first.
                </p>
              )}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                placeholder="e.g., Dinner at Restaurant"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.15s ease-in-out',
                }}
                onFocus={e => e.target.style.borderColor = '#7C3AED'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              marginBottom: '20px' 
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Amount
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: '#6b7280' 
                  }}>
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 28px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.15s ease-in-out',
                    }}
                    onFocus={e => e.target.style.borderColor = '#7C3AED'}
                    onBlur={e => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Paid By
                </label>
                <select
                  value={paidBy || ''}
                  onChange={e => setPaidBy(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease-in-out',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7C3AED'}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Split Type
              </label>
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginBottom: '8px' 
              }}>
                <button
                  type="button"
                  onClick={() => setSplitType('equal')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: splitType === 'equal' ? '#7C3AED' : 'white',
                    color: splitType === 'equal' ? 'white' : '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('percentage')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: splitType === 'percentage' ? '#7C3AED' : 'white',
                    color: splitType === 'percentage' ? 'white' : '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Percentage Split
                </button>
              </div>
            </div>
            
            {splitType === 'percentage' && users.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151' 
                }}>
                  Percentage Splits
                </label>
                <div style={{ 
                  display: 'grid', 
                  gap: '12px',
                  maxHeight: '200px',
                  overflowY: users.length > 4 ? 'auto' : 'visible',
                  padding: users.length > 4 ? '0 8px 8px 0' : '0'
                }}>
                  {users.map((user, idx) => (
                    <div key={user.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      backgroundColor: '#f9fafb',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ 
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#7C3AED',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ 
                        flex: '1',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {user.name}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '120px',
                        position: 'relative'
                      }}>
                        <input
                          type="number"
                          value={splits[idx]?.percentage || ''}
                          onChange={e => handleSplitChange(idx, Number(e.target.value))}
                          min="0"
                          max="100"
                          required={splitType === 'percentage'}
                          style={{
                            width: '100%',
                            padding: '8px 28px 8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontSize: '14px',
                            outline: 'none',
                          }}
                          onFocus={e => e.target.style.borderColor = '#7C3AED'}
                          onBlur={e => e.target.style.borderColor = '#d1d5db'}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          color: '#6b7280',
                          fontSize: '14px'
                        }}>
                          %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ 
                  marginTop: '12px', 
                  fontSize: '14px',
                  color: '#6b7280',
                  textAlign: 'right'
                }}>
                  Total: {splits.reduce((sum, s) => sum + (s.percentage || 0), 0)}%
                  {splits.reduce((sum, s) => sum + (s.percentage || 0), 0) !== 100 && (
                    <span style={{ color: '#dc2626', marginLeft: '8px' }}>
                      (Must equal 100%)
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {error && (
              <div style={{ 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{ 
                backgroundColor: '#f0fdf4', 
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px',
                color: '#16a34a',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {success}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                backgroundColor: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
              onMouseOver={e => {
                if (!loading) e.currentTarget.style.backgroundColor = '#6D28D9';
              }}
              onMouseOut={e => {
                if (!loading) e.currentTarget.style.backgroundColor = '#7C3AED';
              }}
            >
              {loading ? 'Adding Expense...' : 'Add Expense'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 