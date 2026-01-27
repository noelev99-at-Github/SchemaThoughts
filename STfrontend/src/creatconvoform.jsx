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