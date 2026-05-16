import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../FirebaseConfig';
import { doc, getDoc, query, onSnapshot, collection, orderBy, limit } from 'firebase/firestore';
import { ArrowLeft, Clock, User, DollarSign, Fingerprint } from 'lucide-react';

function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
    const [transactions, setTransactions] = useState([]);
  

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. First, try to find it in the 'alerts' collection
//         const alertRef = doc(db, "alerts", id);
//         const alertSnap = await getDoc(alertRef);
        
//         if (alertSnap.exists()) {
//           setData(alertSnap.data());
//         } else {
//           // 2. If it's not an alert, check the 'transactions' collection
//           const txRef = doc(db, "transactions", id);
//           const txSnap = await getDoc(txRef);
          
//           if (txSnap.exists()) {
//             setData(txSnap.data());
//           } else {
//             console.error("No transaction found with this ID in any collection.");
//           }
//         }
//       } catch (error) {
//         console.error("Firebase Fetch Error:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

// //   For querying transactions to get Amount.
//   useEffect(() => {  
//       const qTx = query(collection(db, "transactions"), orderBy("ProcessedAt", "desc"), limit(150));
//       const unsubscribeTx = onSnapshot(qTx, (snapshot) => {
//         setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       });
  
//       return () => { unsubscribeTx(); };
//     }, []);

useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Define references for both potential locations
        const txRef = doc(db, "transactions", id);
        const alertRef = doc(db, "alerts", id);

        // 2. Fetch both simultaneously (Efficiency!)
        const [txSnap, alertSnap] = await Promise.all([
          getDoc(txRef),
          getDoc(alertRef)
        ]);

        let combinedData = {};

        // 3. If it exists in transactions, take that first (has Amount & V-features)
        if (txSnap.exists()) {
          combinedData = { ...txSnap.data() };
        }

        // 4. If it exists in alerts, overlay that data (has AlertLevel)
        if (alertSnap.exists()) {
          combinedData = { ...combinedData, ...alertSnap.data() };
        }

        if (Object.keys(combinedData).length > 0) {
          setData(combinedData);
        } else {
          console.error("No record found for ID:", id);
        }
      } catch (error) {
        console.error("Firebase Fetch Error:", error);
      }
    };

    fetchData();
  }, [id]);


  if (!data) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Transaction Intelligence...</div>;
  console.log(data);

  // Formatting Firestore Timestamps
  const formatTime = (ts) => ts ? ts.toDate().toLocaleString() : "N/A";

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/')} style={{ cursor: 'pointer', border: 'none', background: '#2563eb', color: 'white', padding: '10px 15px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowLeft size={18} /> Return to Dashboard
      </button>

      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Transaction Intelligence Report</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
          
          {/* Core Info */}
          <div>
            <h3 style={{ color: '#2563eb' }}>Basic Details</h3>
            <p><Fingerprint size={16} /> <strong>Transaction ID:</strong> {data.TransactionId}</p>
            <p><User size={16} /> <strong>Sender Identity:</strong> {data.SenderId}</p>

            {
                transactions.map(tx => {
                        <p><DollarSign size={16} /> <strong>Transaction Amount:</strong> ${tx.Amount}</p>
                    }
                )
            }
            <p><DollarSign size={16} /> <strong>Transaction Amount:</strong> ${data.Amount}</p>
            <p><Clock size={16} /> <strong>Triggered At:</strong> {formatTime(data.ProcessedAt || data.AlertGeneratedAt)}</p>
          </div>

          {/* AI Decision Info */}
          <div style={{ backgroundColor: data.IsFlagged || data.AlertLevel ? '#fff1f2' : '#f0fdf4', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ color: data.IsFlagged || data.AlertLevel ? '#dc2626' : '#16a34a' }}>Security Status</h3>
            <p><strong>Risk Level:</strong> {data.AlertLevel || (data.IsFlagged ? "SUSPICIOUS" : "LOW RISK")}</p>
            <p><strong>Risk Score:</strong> {data.RiskScore?.toFixed(4)}</p>
            <p><strong>System Decision:</strong> {data.IsFlagged ? "BLOCKED / HELD" : "SUCCESSFULLY CLEARED"}</p>
          </div>

        </div>

        {/* Feature Mapping Section */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#2563eb' }}>System Trace (Behavioral Features)</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>The following PCA vectors (V1-V28) were analyzed by the XGBoost model to determine the risk score.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', color: '#94a3b8', fontSize: '12px' }}>
            {Object.entries(data).filter(([key]) => key.startsWith('V')).map(([key, val]) => (
              <div key={key} style={{ borderBottom: '1px solid #334155' }}>
                <span style={{ color: '#38bdf8' }}>{key}:</span> {typeof val === 'number' ? val.toFixed(5) : val}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;


// import React, { useEffect, useState } from 'react';
// import { db } from './FirebaseConfig';
// import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
// import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

// function App() {
//   const [alerts, setAlerts] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     // Listen for High-Risk Alerts
//     const qAlerts = query(collection(db, "alerts"), orderBy("AlertGeneratedAt", "desc"), limit(5));
//     const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
//       setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });

//     // Listen for All Transactions
//     const qTx = query(collection(db, "transactions"), orderBy("ProcessedAt", "desc"), limit(10));
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