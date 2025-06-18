import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CreateGroup from './pages/CreateGroup';
import AddExpense from './pages/AddExpense';
import GroupBalances from './pages/GroupBalances';
import MyBalances from './pages/MyBalances';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: '600', 
        color: '#1f2937',
        marginBottom: '16px',
        fontFamily: 'Inter, sans-serif'
      }}>
        Welcome to Expense Tracker
      </h1>
      <p style={{ 
        fontSize: '16px', 
        color: '#6b7280',
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Track expenses with friends and family. Split bills easily and see who owes what.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginTop: '40px'
      }}>
        <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>
            Create Groups
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Start by creating a group and adding your friends or family members.
          </p>
        </div>
        
        <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>
            Add Expenses
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Record expenses and split them equally or by custom percentages.
          </p>
        </div>
        
        <div className="card" style={{ padding: '24px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#1f2937' }}>
            Track Balances
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            See who owes what and keep track of all your shared expenses.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/group-balances" element={<GroupBalances />} />
          <Route path="/my-balances" element={<MyBalances />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 