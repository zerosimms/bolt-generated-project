import React from 'react'

interface DayItemProps {
  day: {
    name: string
    date: string
    fullDate: string
  }
  selectedDay: string
  hasExercises: (day: string) => boolean
  dayLocations?: { [key: string]: string }
  onSelectDay: (day: string) => void
  setDayLocations?: (locations: { [key: string]: string }) => void
  isRestDay: boolean
}

const DayItem: React.FC<DayItemProps> = ({
  day,
  selectedDay,
  hasExercises,
  dayLocations,
  onSelectDay,
  setDayLocations,
  day: { fullDate },
}) => {
  const isRestDay = dayLocations?.[fullDate] === 'rest'

  const handleLocationChange = (day: string, location: string) => {
    setDayLocations?.((prevLocations) => ({
      ...prevLocations,
      [day]: location,
    }))
  }

  return (
    <div key={fullDate} className="flex-shrink-0 w-32">
      <div
        className={`shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base transition-colors duration-200 relative ${
          !isRestDay && dayLocations?.[fullDate] !== 'rest' && dayLocations?.[fullDate] !== undefined
            ? 'bg-green-200 dark:bg-green-700'
            : 'bg-white dark:bg-gray-800'
        }`}
      >
        {day.name}
        <br />
        <span className="text-xs">{day.date}</span>
      </div>
      <select
        value={dayLocations?.[fullDate] || 'gym'}
        onChange={(e) => handleLocationChange(fullDate, e.target.value)}
        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline mt-2"
      >
        <option value="gym">Gym</option>
        <option value="home">Home</option>
        <option value="rest">Rest</option>
      </select>
    </div>
  )
}

export default DayItem
