import { useState, useEffect } from 'react';
import { apiService, Group, Balance } from '../services/api';

export default function GroupBalances() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoadingGroups(true);
    apiService.getGroups()
      .then(response => {
        setGroups(response.data);
      })
      .catch(err => {
        console.error("Failed to fetch groups:", err);
      })
      .finally(() => {
        setLoadingGroups(false);
      });
  }, []);

  useEffect(() => {
    if (groupId) {
      setLoading(true);
      apiService.getGroupBalances(groupId)
        .then(response => {
          setBalances(response.data);
        })
        .catch(err => {
          console.error("Failed to fetch balances:", err);
          setError('Failed to fetch balances');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [groupId]);

  return (
    <div>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        marginBottom: '24px', 
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif'
      }}>
        Group Balances
      </h2>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        {loadingGroups ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="loading-spinner"></div>
            <span style={{ marginLeft: '12px', color: '#6b7280' }}>Loading groups...</span>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Select Group
              </label>
              <select
                value={groupId || ''}
                onChange={e => setGroupId(Number(e.target.value))}
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
            
            {loading && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '40px 0',
                color: '#6b7280'
              }}>
                <div className="loading-spinner"></div>
                <span style={{ marginLeft: '12px' }}>Loading balances...</span>
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
            
            {!loading && balances.length > 0 && (
              <div style={{ 
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  backgroundColor: '#f9fafb',
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#4b5563' 
                  }}>
                    User
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: '600', 
                    color: '#4b5563',
                    textAlign: 'right'
                  }}>
                    Balance
                  </div>
                </div>
                
                {balances.map((b) => (
                  <div 
                    key={b.user_id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      padding: '14px 16px',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: 'white'
                    }}
                  >
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '500', 
                      color: '#111827',
                      display: 'flex',
                      alignItems: 'center'
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
                        fontSize: '14px',
                        marginRight: '12px'
                      }}>
                        {b.user_name.charAt(0).toUpperCase()}
                      </div>
                      {b.user_name}
                    </div>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: '600',
                      textAlign: 'right',
                      color: b.amount < 0 ? '#dc2626' : '#16a34a'
                    }}>
                      {b.amount < 0 ? (
                        <span>Owes ${Math.abs(b.amount).toFixed(2)}</span>
                      ) : (
                        <span>Gets ${b.amount.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && balances.length === 0 && groupId && (
              <div style={{ 
                padding: '40px 0',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  fill="currentColor" 
                  viewBox="0 0 16 16"
                  style={{ margin: '0 auto 16px' }}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                <p style={{ fontSize: '16px' }}>No balances found for this group.</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Try adding some expenses first.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 