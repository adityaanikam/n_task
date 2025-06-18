import { useState, useEffect } from 'react';
import { apiService, Balance } from '../services/api';

const USER_ID = 1; // Replace with actual user ID from auth if available

export default function MyBalances() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.getUserBalances(USER_ID)
      .then((response) => setBalances(response.data))
      .catch(() => setError('Unable to load balances. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        marginBottom: '24px', 
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif'
      }}>
        My Balances
      </h2>
      
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '40px 0' 
        }}>
          <div className="loading-spinner"></div>
          <span style={{ marginLeft: '12px', color: '#6b7280' }}>Loading balances...</span>
        </div>
      )}
      
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          color: '#dc2626',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}
      
      {!loading && !error && balances.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  User
                </th>
                <th style={{ 
                  padding: '12px 16px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance, idx) => (
                <tr key={idx} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ 
                    padding: '16px', 
                    fontWeight: '500', 
                    color: '#1f2937',
                    fontSize: '14px'
                  }}>
                    {balance.user_name}
                  </td>
                  <td style={{ 
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: balance.amount < 0 ? '#dc2626' : '#059669'
                  }}>
                    {balance.amount < 0 
                      ? `Owes $${Math.abs(balance.amount).toFixed(2)}` 
                      : `Gets $${balance.amount.toFixed(2)}`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && !error && balances.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          <div style={{ marginBottom: '8px' }}>No balances to show</div>
          <div style={{ fontSize: '14px' }}>Create a group and add some expenses to get started!</div>
        </div>
      )}
    </div>
  );
} 