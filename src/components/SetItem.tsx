import React from 'react'
import { Trash2 } from 'lucide-react'

interface SetItemProps {
  weight: number
  reps: number
  done: boolean
  onUpdate: (weight: number, reps: number, done: boolean) => void
  onToggleDone: (done: boolean) => void
  onDelete: () => void
}

const SetItem: React.FC<SetItemProps> = ({ weight, reps, done, onUpdate, onToggleDone, onDelete }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="number"
        placeholder="Weight"
        value={weight === 0 ? '' : weight}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newWeight = parseInt(e.target.value) || 0
          onUpdate(newWeight, reps, done)
        }}
        className="shadow appearance-none border rounded-md w-20 py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline mr-2 text-sm"
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps === 0 ? '' : reps}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newReps = parseInt(e.target.value) || 0
          onUpdate(weight, newReps, done)
        }}
        className="shadow appearance-none border rounded-md w-20 py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline mr-2 text-sm"
      />
      <label className="inline-flex items-center mt-3">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={done}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onToggleDone(e.target.checked)
          }}
        />
        <span className="ml-2 text-gray-700 dark:text-gray-200 text-sm">Done</span>
      </label>
      <button onClick={onDelete} className="ml-4 text-red-500 hover:text-red-700 focus:outline-none">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default SetItem
