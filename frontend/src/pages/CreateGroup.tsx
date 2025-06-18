import { useState } from 'react';
import { apiService } from '../services/api';

interface UserInput {
  name: string;
  email: string;
}

export default function CreateGroup() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState<UserInput[]>([{ name: '', email: '' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUserChange = (idx: number, field: keyof UserInput, value: string) => {
    setUsers((prev) => prev.map((u, i) => (i === idx ? { ...u, [field]: value } : u)));
  };

  const addUser = () => setUsers((prev) => [...prev, { name: '', email: '' }]);
  const removeUser = (idx: number) => setUsers((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const filteredUsers = users.filter(u => u.name && u.email);
      if (!name || filteredUsers.length === 0) {
        setError('Group name and at least one user are required.');
        setLoading(false);
        return;
      }
      await apiService.createGroup({ name, description, users: filteredUsers });
      setSuccess('Group created successfully!');
      setName('');
      setDescription('');
      setUsers([{ name: '', email: '' }]);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create group');
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
        Create New Group
      </h2>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151' 
            }}>
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Enter group name"
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
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional description of the group"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out',
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={e => e.target.style.borderColor = '#7C3AED'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <label style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Group Members
              </label>
              <button
                type="button"
                onClick={addUser}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  color: '#7C3AED',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Add Member
              </button>
            </div>
            
            <div style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr auto',
                padding: '12px 16px',
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Name</div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Email</div>
                <div></div>
              </div>
              
              <div style={{ 
                maxHeight: '300px',
                overflowY: users.length > 5 ? 'auto' : 'visible'
              }}>
                {users.map((user, idx) => (
                  <div key={idx} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr auto',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: idx < users.length - 1 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: idx % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    <input
                      type="text"
                      placeholder="Name"
                      value={user.name}
                      onChange={e => handleUserChange(idx, 'name', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = '#7C3AED'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={e => handleUserChange(idx, 'email', e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = '#7C3AED'}
                      onBlur={e => e.target.style.borderColor = '#d1d5db'}
                    />
                    {users.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUser(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        title="Remove user"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
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
            {loading ? 'Creating Group...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
} 