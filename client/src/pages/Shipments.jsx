import React, { useState, useEffect } from 'react';
import '../styles/Shipments.css';

function Shipments({ user }) {
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipmentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/${user.id}`);
        const data = await response.json();
        setShipments(data.shipments);
      } catch (err) {
        setError('Failed to fetch shipment data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipmentData();
  }, [user.id]);

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading shipment data...</p>
    </div>
  );

  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="shipments-container">
      <h1 className="page-title">Medication Shipments</h1>

      {shipments.length === 0 ? (
        <div className="no-shipments card">
          <p>No shipments found</p>
        </div>
      ) : (
        <div className="shipments-list">
          {shipments.map(shipment => (
            <div key={shipment.id} className="shipment-card card">
              <div className="shipment-header">
                <h3>{shipment.medication} - {shipment.dosage}</h3>
                <span className={`status-badge ${shipment.status}`}>
                  {shipment.status}
                </span>
              </div>

              <div className="shipment-details">
                <div className="detail">
                  <span className="detail-label">Estimated Delivery:</span>
                  <span className="detail-value">
                    {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>

                {shipment.actualDelivery && (
                  <div className="detail">
                    <span className="detail-label">Delivered On:</span>
                    <span className="detail-value">
                      {new Date(shipment.actualDelivery).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {shipment.trackingNumber && (
                  <div className="detail">
                    <span className="detail-label">Tracking Number:</span>
                    <span className="detail-value">
                      {shipment.trackingNumber}
                    </span>
                  </div>
                )}
              </div>

              {(shipment.status === 'shipped' || shipment.status === 'preparing') && (
                <button className="btn btn-primary track-button">
                  Track Package
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Shipments;