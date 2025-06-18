import { Link, useLocation } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Chat from './Chat';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const userId = 1; // Demo user ID

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#1f2937',
            fontFamily: 'Inter, sans-serif'
          }}>
            <Link to="/" style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Expense Tracker
            </Link>
          </h1>
          
          {/* User Profile */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt="User" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                border: '2px solid #7C3AED'
              }} 
            />
            <div>
              <div style={{ 
                fontWeight: '500', 
                color: '#1f2937',
                fontSize: '14px'
              }}>
                Demo User
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280' 
              }}>
                demo@email.com
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Action Buttons Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          margin: '32px 0 40px',
          flexWrap: 'wrap',
          padding: '0 16px'
        }}>
          <Link 
            to="/create-group" 
            style={{ 
              backgroundColor: location.pathname === '/create-group' ? '#6D28D9' : '#7C3AED',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = location.pathname === '/create-group' ? '#6D28D9' : '#7C3AED';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Create Group
          </Link>
          <Link 
            to="/add-expense" 
            style={{ 
              backgroundColor: location.pathname === '/add-expense' ? '#6D28D9' : '#7C3AED',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = location.pathname === '/add-expense' ? '#6D28D9' : '#7C3AED';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Expense
          </Link>
          <Link 
            to="/group-balances" 
            style={{ 
              backgroundColor: location.pathname === '/group-balances' ? '#6D28D9' : '#7C3AED',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = location.pathname === '/group-balances' ? '#6D28D9' : '#7C3AED';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Group Balances
          </Link>
          <Link 
            to="/my-balances" 
            style={{ 
              backgroundColor: location.pathname === '/my-balances' ? '#6D28D9' : '#7C3AED',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = location.pathname === '/my-balances' ? '#6D28D9' : '#7C3AED';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Balances
          </Link>
        </div>

        {/* Page Content */}
        <div style={{ 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          minHeight: '400px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </main>

      {/* Chatbot */}
      <Chat userId={userId} />
    </div>
  );
} 