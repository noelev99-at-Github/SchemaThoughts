import React from 'react';
import "./sidebar.css";

function Sidebar({ isCollapsed, setIsCollapsed, setShowForm, maps }) {
  return (
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
  );
}

export default Sidebar;
