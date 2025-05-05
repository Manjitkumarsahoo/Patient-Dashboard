import React, { useState, useEffect } from 'react';
import WeightChart from '../components/WeightChart';
import '../styles/WeightProgress.css';

function WeightProgress({ user }) {
  const [weightEntries, setWeightEntries] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/${user.id}`);
        const data = await response.json();
        setWeightEntries(data.weightEntries);
      } catch (err) {
        setError('Failed to fetch weight data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeightData();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://localhost:5000/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          date: newDate,
          weight: newWeight
        }),
      });
      
      const newEntry = await response.json();
      setWeightEntries([...weightEntries, newEntry]);
      setNewWeight('');
      setSuccess('Weight entry added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add weight entry');
    }
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading weight data...</p>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="weight-progress-container">
      <h1 className="page-title">Weight Progress</h1>
      
      <div className="chart-container card">
        <WeightChart weightEntries={weightEntries} />
      </div>
      
      <div className="add-weight-container card">
        <h3>Add New Weight Entry</h3>
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="weight-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight-date">Date</label>
              <input
                type="date"
                id="weight-date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight-value">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                id="weight-value"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Add Entry
          </button>
        </form>
      </div>
      
      {weightEntries.length > 0 && (
        <div className="weight-history card">
          <h3>Weight History</h3>
          <div className="table-container">
            <table className="weight-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (lbs)</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {weightEntries
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry, index) => {
                    const change = index < weightEntries.length - 1 
                      ? entry.weight - weightEntries[index + 1].weight
                      : 0;
                    
                    return (
                      <tr key={entry.id}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.weight}</td>
                        <td className={change > 0 ? 'negative' : change < 0 ? 'positive' : ''}>
                          {index < weightEntries.length - 1 && (
                            <>
                              {change > 0 ? '+' : ''}
                              {change.toFixed(1)} lbs
                              {change > 0 ? ' ▲' : change < 0 ? ' ▼' : ''}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeightProgress;