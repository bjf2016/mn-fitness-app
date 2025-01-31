import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");

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
    if (exercise && reps) {
      const newWorkout = { exercise, reps };
      setWorkouts([...workouts, newWorkout]);
      setExercise("");
      setReps("");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🏋️‍♂️ Fitness Tracker</h1>

      {/* Workout Input */}
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">Log Your Workout</h4>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Exercise (e.g., Bench Press)"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>
        <div className="input-group mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={addWorkout}>
          Add Workout
        </button>
      </div>

      {/* Workout Log */}
      <h2 className="text-center mt-4">Your Workouts</h2>
      {workouts.length === 0 ? (
        <p className="text-center text-muted">No workouts logged yet.</p>
      ) : (
        <ul className="list-group mt-3">
          {workouts.map((workout, index) => (
            <li key={index} className="list-group-item">
              <strong>{workout.exercise}</strong> - {workout.reps} reps
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
