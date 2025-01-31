import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState(0);

  // Load stored workouts from local storage
  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts"));
    if (savedWorkouts) {
      setWorkouts(savedWorkouts);
    }
  }, []);

  // Save workouts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = () => {
    if (exercise && reps && weight) {
      const estimatedCalories = calculateCalories(weight, reps);
      const newWorkout = { exercise, reps, weight, calories: estimatedCalories };
      setWorkouts([...workouts, newWorkout]);
      setExercise("");
      setReps("");
      setWeight("");
      setCalories(0);
    }
  };

  const exportWorkouts = () => {
    if (workouts.length === 0) {
      alert("No workouts to export!");
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workouts, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workouts.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
  };
  
  // ✅ Add a new function for clearing workouts
    const clearWorkouts = () => {
      if (workouts.length === 0) {
        alert("No workouts to clear!");
      return;
    }

    const confirmClear = window.confirm("Are you sure you want to clear all workouts?");
      if (confirmClear) {
        setWorkouts([]);
      localStorage.removeItem("workouts");
    }
  };

  const importWorkouts = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedWorkouts = JSON.parse(e.target.result);
        setWorkouts(importedWorkouts);
        localStorage.setItem("workouts", JSON.stringify(importedWorkouts));
      } catch (error) {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };
  
  const deleteWorkout = (index) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };
 

  const generateProgressData = () => {
    if (workouts.length < 2) return null; // Need at least 2 workouts to show a graph
  
    const labels = workouts.map((_, index) => `Workout ${index + 1}`);
    const weights = workouts.map((workout) => workout.weight);
  
    return {
      labels,
      datasets: [
        {
          label: "Weight Lifted Over Time",
          data: weights,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
      ],
    };
  };

  const calculateCalories = (weight, reps) => {
    return Math.round((weight * reps * 0.1)); // Simple calorie estimation
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🏋️‍♂️ Fitness Tracker</h1>

      {/* Import Workouts Section - Move Higher */}
      <div className="text-center mt-3">
      <h4>📂 Import Workouts</h4>
      <input type="file" accept="application/json" onChange={importWorkouts} className="form-control w-50 mx-auto" style={{ display: "block" }} />
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          {/* Workout Input */}
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Log Your Workout</h4>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Exercise (e.g., Bench Press)"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="number"
                className="form-control"
                placeholder="Weight (lbs)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" onClick={addWorkout}>
              Add Workout
            </button>
          </div>
        </div>




      </div>

{/* Workout Log */}
<h2 className="text-center mt-4">Your Workouts</h2>
{workouts.length === 0 ? (
  <p className="text-center text-muted">No workouts logged yet.</p>
) : (
  <div className="row justify-content-center">
    <div className="col-md-8 col-sm-12">
  
  <ul className="list-group mt-3">
  {workouts.map((workout, index) => (
    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
      <span>
        <strong>{workout.exercise}</strong> - {workout.reps} reps at {workout.weight} lbs - 🔥 {workout.calories} calories burned
      </span>
      <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(index)}>❌ Delete</button>
    </li>
  ))}
  </ul>


      {/* Export Workouts Button - Placed Right Below Workout List */}
      <button className="btn btn-success mt-3" onClick={exportWorkouts}>
        📥 Export Workouts
      </button>

      {/* Clear Workouts Button */}
      <button className="btn btn-warning mt-3" onClick={clearWorkouts}>
        🗑️ Clear All Workouts
      </button>
    
      {/* ✅ Progress Tracker - Add Graph Below Workout List ✅ */}
      <div className="mt-4">
        <h3 className="text-center">📈 Progress Tracker</h3>
        {workouts.length > 1 ? (
          <Line data={generateProgressData()} />
        ) : (
          <p className="text-muted text-center">Add at least 2 workouts to see progress.</p>
        )}
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default App;
