import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [nairaExchangeRate, setNairaRateExchange] = useState(null);

  useEffect(() => {
    const qAlerts = query(collection(db, "alerts"), orderBy("AlertGeneratedAt", "desc"), limit(150));
    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qTx = query(collection(db, "transactions"), orderBy("ProcessedAt", "desc"), limit(150));
    const unsubscribeTx = onSnapshot(qTx, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubscribeAlerts(); unsubscribeTx(); };
  }, []);

  // useEffect(() => {
  //   const API_ENDPOINT = import.meta.env.VITE_API_LAYER_BASE_URL;
  //   const API_KEY = import.meta.env.VITE_API_LAYER_API_KEY;

  //   const response = fetch(`${import.meta.env.VITE_API_LAYER_BASE_URL}?access_key=${API_KEY}&symbols=USD,NGN`);
  //   console.log(response);
  //   const dollarToNaira = response.quotes.USDNGN;
  //   setNairaRateExchange(dollarToNaira);
  //   console.log(dollarToNaira);
  //   // https://api.exchangerate.host/live?access_key=510ae6afe127a7fa38dabc53f69b712e&symbols=USD,EUR
  // }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const API_KEY = import.meta.env.VITE_API_LAYER_API_KEY;
        const API_ENDPOINT = import.meta.env.VITE_API_LAYER_BASE_URL;

        const response = await fetch(
          `${API_ENDPOINT}?access_key=${API_KEY}&symbols=NGN`
        );

        const data = await response.json();

        console.log(data);

        const dollarToNaira = data.quotes?.USDNGN;

        if (dollarToNaira) {
          setNairaRateExchange(dollarToNaira);
        }

      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchExchangeRate();

  }, []);

  const linkStyle = { textDecoration: 'none', color: 'inherit' };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity color="#2563eb" size={32} />
        <h1>ITMS Command Center</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        {/* ALERT PANEL */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '5px solid #dc2626', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle color="#dc2626" /> Active Fraud Alerts</h2>
          {alerts.map(alert => (
            <Link to={`/transaction/${alert.id}`} key={alert.id} style={linkStyle}>
              <div style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer' }} className="list-item">
                <strong style={{ color: '#dc2626' }}>{alert.AlertLevel}: {alert.TransactionId.substring(0, 8)}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>Score: {alert.RiskScore?.toFixed(2)} | User: {alert.SenderId}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* RECENT TRANSACTIONS */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', borderTop: '5px solid #2563eb', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle color="#2563eb" /> Activity Stream</h2>
          {transactions.map(tx => (
            <Link to={`/transaction/${tx.id}`} key={tx.id} style={linkStyle}>
              <div style={{ padding: '12px', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                <span>ID: {tx.TransactionId?.substring(0, 8)}...</span>
                <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>${tx.Amount}</span>
                <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                  {/* <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    {
                      nairaExchangeRate
                        ? `₦${(tx.Amount * nairaExchangeRate).toLocaleString()}`
                        : "Loading..."
                    }
                  </span> */}
                  <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    ₦{(tx.Amount * nairaExchangeRate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </span>
                {/* <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>₦{tx.Amount * nairaExchangeRate}</span> */}
                <span style={{ float: 'right', fontWeight: 'bold', color: tx.IsFlagged ? '#dc2626' : '#16a34a' }}>
                  {tx.IsFlagged ? 'FLAGGED' : 'CLEARED'}
                </span>
              </div>
            </Link>
          ))}
        </section>

      </div>
    </div>
  );
}

export default Dashboard;

