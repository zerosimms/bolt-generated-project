import React, { useState, useEffect } from 'react'
import ExerciseForm from './components/ExerciseForm'
import DaySelector from './components/DaySelector'
import useExercises, { Exercise } from './hooks/useExercises'
import BottomMenu from './components/BottomMenu'
import ExerciseList from './components/ExerciseList'
import HistoryList from './components/HistoryList'
import Profile from './components/Profile'
import { Moon, Sun } from 'lucide-react'
import Stats from './components/Stats'
import Trainer from './components/Trainer'

const popularExercisesList = [
  'Bench press',
  'Deadlift',
  'Squat',
  'Overhead press',
  'Bent-over rows',
  'Pull-ups',
  'Incline bench press',
  'Lat pulldown',
  'Seated cable row',
  'Romanian deadlift',
  'Lunges',
  'Step-ups',
  'Dumbbell curls',
  'Hammer curls',
  'Tricep dips',
  'Skull crushers',
  'Arnold press',
  'Lateral raises',
  'Shrugs',
  'Hip thrusts',
  'Glute bridges',
  'Good mornings',
  'Sumo deadlift',
  'Close-grip bench press',
  'Front squat',
  'T-bar rows',
  'Barbell curls',
  'Upright rows',
]

function App() {
  const { exercises, addExercise, deleteExercise, updateSet, addSet, toggleSetDone, deleteSet, history, deleteHistory, updateHistory, weightUnit } =
    useExercises()
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0])
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });
  const [activeTab, setActiveTab] = useState('trainer')
  const [dayLocations, setDayLocations] = useState<{ [key: string]: string }>(() => {
    const storedLocations = localStorage.getItem('dayLocations');
    return storedLocations ? JSON.parse(storedLocations) : {};
  })

  useEffect(() => {
    localStorage.setItem('dayLocations', JSON.stringify(dayLocations));
  }, [dayLocations]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredExercises = exercises.filter((exercise) => exercise.day === selectedDay)

  const hasExercisesOnDay = (day: string) => {
    return exercises.some((exercise) => exercise.day === day)
  }

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 font-sans">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">My Exercise List</h1>
        </div>

        {activeTab === 'gym' && (
          <div>
            <DaySelector onSelectDay={handleDaySelect} selectedDay={selectedDay} hasExercises={hasExercisesOnDay} dayLocations={dayLocations} setDayLocations={setDayLocations} className="mb-4" />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {dayLocations[selectedDay] !== 'rest' && (
                <>
                  <ExerciseForm
                    onAdd={(title) => addExercise(title, selectedDay)}
                    popularExercises={popularExercisesList}
                  />
                  <ExerciseList
                    exercises={filteredExercises}
                    deleteExercise={deleteExercise}
                    updateSet={updateSet}
                    addSet={addSet}
                    toggleSetDone={toggleSetDone}
                    deleteSet={deleteSet}
                  />
                </>
              )}
              {dayLocations[selectedDay] === 'rest' && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  Enjoy your rest day!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Exercise History</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <HistoryList history={history} onDeleteHistory={deleteHistory} onUpdateHistory={updateHistory} weightUnit={weightUnit} key={weightUnit} />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <Stats />
        )}

        {activeTab === 'profile' && (
          <Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        )}

        {activeTab === 'trainer' && (
          <Trainer />
        )}
      </div>
      <BottomMenu activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
