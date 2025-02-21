import React, { useState, useEffect } from 'react'
import DaySelector from './DaySelector'

const Trainer: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0])
  const [dayLocations, setDayLocations] = useState<{ [key: string]: string }>(() => {
    const storedLocations = localStorage.getItem('dayLocations')
    return storedLocations ? JSON.parse(storedLocations) : {}
  })
  const [program, setProgram] = useState<string[]>([])

  useEffect(() => {
    localStorage.setItem('dayLocations', JSON.stringify(dayLocations))
  }, [dayLocations])

  const handleDaySelect = (day: string) => {
    setSelectedDay(day)
  }

  const hasExercisesOnDay = (day: string) => {
    return false
  }

  const handleBuildProgram = () => {
    const workoutDays: string[] = []
    Object.entries(dayLocations).forEach(([day, location]) => {
      if (location === 'gym' || location === 'home') {
        const date = new Date(day)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        const formattedDate = date.toLocaleDateString('en-US')
        workoutDays.push(`${dayName} - ${formattedDate} (${location})`)
      }
    })
    setProgram(workoutDays)
  }

  return (
    <div>
      <DaySelector
        onSelectDay={handleDaySelect}
        selectedDay={selectedDay}
        hasExercises={hasExercisesOnDay}
        dayLocations={dayLocations}
        setDayLocations={setDayLocations}
      />
      <button
        onClick={handleBuildProgram}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Build My Program
      </button>
      <div>
        {program.map((day, index) => (
          <p key={index}>{day}</p>
        ))}
      </div>
    </div>
  )
}

export default Trainer
