import React from 'react'
import DayItem from './DayItem'

interface DaySelectorProps {
  onSelectDay: (day: string) => void
  selectedDay: string
  hasExercises: (day: string) => boolean
  dayLocations?: { [key: string]: string }
  setDayLocations: (locations: { [key: string]: string }) => void
}

interface DayData {
  name: string
  date: string
  fullDate: string
}

const DaySelector: React.FC<DaySelectorProps> = ({ onSelectDay, selectedDay, hasExercises, dayLocations, setDayLocations }) => {
  const getNext7Days = () => {
    const days: DayData[] = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayNumber = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      days.push({
        name: dayName,
        date: `${dayNumber} ${month}`,
        fullDate: date.toISOString().split('T')[0],
      })
    }
    return days
  }

  const days = getNext7Days()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-4 overflow-x-auto">
        {days.map((day) => (
          <DayItem
            key={day.fullDate}
            day={day}
            selectedDay={selectedDay}
            hasExercises={hasExercises}
            dayLocations={dayLocations}
            onSelectDay={onSelectDay}
            setDayLocations={setDayLocations}
            isRestDay={dayLocations?.[day.fullDate] === 'rest'}
          />
        ))}
      </div>
    </div>
  )
}

export default DaySelector
