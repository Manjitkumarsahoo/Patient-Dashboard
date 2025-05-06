import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeightChart from '../components/WeightChart';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/${user.id}`);
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;
  if (!dashboardData) return <div className="no-data">No data available</div>;

  const { weightEntries, shipments } = dashboardData;

  const latestWeight = weightEntries.length > 0
    ? weightEntries[weightEntries.length - 1].weight
    : user.currentWeight;

  const nextShipment = shipments.find(s => s.status !== 'delivered');
  const bmi = (latestWeight / (user.height * user.height)) * 703;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome back, {user.name.split(' ')[0]}</h1>

      <div className="summary-grid">
        <div className="summary-card health-card">
          <h3>Current Health</h3>
          <div className="health-stats">
            <div className="stat">
              <span className="stat-value">{latestWeight} lbs</span>
              <span className="stat-label">Weight</span>
            </div>
            <div className="stat">
              <span className="stat-value">{bmi.toFixed(1)}</span>
              <span className="stat-label">BMI</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.goalWeight} lbs</span>
              <span className="stat-label">Goal</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/weight')}
            className="btn btn-primary"
          >
            Track Progress
          </button>
        </div>

        {nextShipment && (
          <div className="summary-card shipment-card">
            <h3>Next Medication</h3>
            <div className="shipment-info">
              <p><strong>Type:</strong> {nextShipment.medication}</p>
              <p><strong>Dosage:</strong> {nextShipment.dosage}</p>
              <p><strong>Status:</strong>
                <span className={`status-badge ${nextShipment.status}`}>
                  {nextShipment.status}
                </span>
              </p>
              <p><strong>Expected:</strong> {new Date(nextShipment.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => navigate('/shipments')}
              className="btn btn-primary"
            >
              View All Shipments
            </button>
          </div>
        )}
      </div>

      <div className="chart-container card">
        <h3>Weight Progress</h3>
        <div className="chart-wrapper">
          <WeightChart weightEntries={weightEntries} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;