import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import axios from "axios";

function CreateMapForm({ onClose }) {
  const [mapName, setMapName] = useState("");
  const handleSubmit = async (e) => {
    
    try {
      const response = await axios.post(
        "http://localhost:8000/createmap",
        { mapName }
      );
      console.log("Response:", response.data);
      alert("Data sent successfully!");
      setMapName("");
      onClose();
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Failed to send data.");
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2 className="form-title">Create New Schema</h2>
          <input
            className="mapinput"
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            placeholder="Enter Schema name..."
            required
            autoFocus
          />
        <br></br>
        <div className="form-buttons">
          <button className="createButton" type="submit">Create</button>
          <button className="whitebutton" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Dashboard() {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [maps, setMaps] = useState([]);

    const fetchMaps = async () => {
    try {
        const response = await axios.get("http://localhost:8000/existingmaps");
        setMaps(response.data.maps);
    } catch (err) {
        console.error("Error fetching maps: ", err);
    }
    };

    useEffect(() => {
    fetchMaps();
    }, []);

    return (
        <div className={`dashboard-container ${isCollapsed ? 'sidebar-hidden' : ''}`}>
        {/* Left Panel */}
        <aside className="sidebar">
            <div className="sidebar-top">
            <button className="menu-icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </button>
            {!isCollapsed && 
                <button className="blackbutton" onClick={() => setShowForm(true)}>
                Create New Schema
                </button>
            }
            </div>

            {!isCollapsed && (
            <div className="topic-list">
            <p className="section-title">Schemas Thoughts</p>
            {maps.map((mapItem) => (
            <div key={mapItem.id} className="topic-item">
            <span className="topic-text">{mapItem.mapName}</span>
            </div>
            ))}
            </div>
            )}

            <div className="sidebar-footer">
            <div className="user-profile">{!isCollapsed && "Log Out"}</div>
            </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
            <header>
            </header>
            <div className="content-body">
            
            </div>
        </main>

        {/* Form Modal */}
        {showForm && <CreateMapForm onClose={() => setShowForm(false)} />}
        </div>
    );
    }

export default Dashboard;