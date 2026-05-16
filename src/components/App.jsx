import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TransactionDetail from './TransactionDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction/:id" element={<TransactionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useEffect, useState } from 'react';
// import { db } from './FirebaseConfig';
// import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
// import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

// function App() {
//   const [alerts, setAlerts] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     // Listen for High-Risk Alerts
//     const qAlerts = query(collection(db, "alerts"), orderBy("AlertGeneratedAt", "desc"), limit(100));
//     const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
//       setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });

//     // Listen for All Transactions
//     const qTx = query(collection(db, "transactions"), orderBy("ProcessedAt", "desc"), limit(100));
//     const unsubscribeTx = onSnapshot(qTx, (snapshot) => {
//       setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });

//     return () => { unsubscribeAlerts(); unsubscribeTx(); };
//   }, []);

//   return (
//     <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//       <header style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//         <Activity color="#2563eb" size={32} />
//         <h1>ITMS Command Center</h1>
//       </header>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
//         {/* ALERT PANEL */}
//         <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '5px solid #dc2626' }}>
//           <h2><AlertTriangle color="#dc2626" /> Active Fraud Alerts</h2>
//           {alerts.map(alert => (
//             <div key={alert.id} style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#991b1b' }}>
//               <strong>CRITICAL: {alert.TransactionId.substring(0,8)}</strong>
//               <p>Risk Score: {alert.RiskScore?.toFixed(2)} | User: {alert.SenderId}</p>
//             </div>
//           ))}
//         </section>

//         {/* RECENT TRANSACTIONS */}
//         <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '5px solid #2563eb' }}>
//           <h2><CheckCircle color="#2563eb" /> Activity Stream</h2>
//           {transactions.map(tx => (
//             <div key={tx.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
//               <span>ID: {tx.TransactionId?.substring(0,8)}...</span>
//               <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>${tx.Amount}</span>
//               <span style={{ float: 'right', color: tx.IsFlagged ? '#dc2626' : '#16a34a' }}>
//                 {tx.IsFlagged ? 'FLAGGED' : 'CLEARED'}
//               </span>
//             </div>
//           ))}
//         </section>

//       </div>
//     </div>
//   );
// }

// export default App;