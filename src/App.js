import React, { useState } from "react";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [reps, setReps] = useState("");

  const addWorkout = () => {
    if (exercise && reps) {
      setWorkouts([...workouts, { exercise, reps }]);
      setExercise("");
      setReps("");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🏋️‍♂️ Fitness Tracker</h1>
      <p>Log your workouts and track progress!</p>

      {/* Workout Input */}
      <div>
        <input
          type="text"
          placeholder="Exercise (e.g., Bench Press)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <button onClick={addWorkout}>Add Workout</button>
      </div>

      {/* Workout Log */}
      <h2>Your Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <ul>
          {workouts.map((workout, index) => (
            <li key={index}>
              {workout.exercise} - {workout.reps} reps
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
