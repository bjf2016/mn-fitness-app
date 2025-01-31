import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const calculateCalories = (weight, reps) => {
    return Math.round((weight * reps * 0.1)); // Simple calorie estimation
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🏋️‍♂️ Fitness Tracker</h1>

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
                <li key={index} className="list-group-item">
                  <strong>{workout.exercise}</strong> - {workout.reps} reps at {workout.weight} lbs - 🔥 {workout.calories} calories burned
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
