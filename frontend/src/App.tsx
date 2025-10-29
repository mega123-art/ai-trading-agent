import { useEffect, useState } from 'react'
import './App.css'
import PerformanceChart from './components/PerformanceChart'
import RecentInvocations from './components/RecentInvocations'

const BACKEND_URL = "http://localhost:3000";

// colors moved into PerformanceChart

function App() {

  const [performanceData, setPerformanceData] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [invocationsData, setInvocationsData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/performance`)
      .then(res => res.json())
      .then(data => {
        setPerformanceData(data.data);
        setLastUpdated(data.lastUpdated);
      });
    fetch(`${BACKEND_URL}/invocations?limit=30`)
      .then(res => res.json())
      .then(data => setInvocationsData(data.data));
  }, []);

  // chart data and rendering moved into PerformanceChart

  return (
    <div>
      <h1>Performance</h1>
      {(!performanceData || !invocationsData) && (
        <div>Loading...</div>
      )}
      {performanceData && invocationsData && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 2, minWidth: 0 }}>
            <PerformanceChart data={performanceData} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <RecentInvocations data={invocationsData} />
          </div>
        </div>
      )}
      {lastUpdated && (
        <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default App
