import React, { useState } from 'react'
import { CheckCircle, Circle, Trash2 } from 'lucide-react'

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  weight: number
  reps: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, weight: number, reps: number) => void
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  weight,
  reps,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [localWeight, setLocalWeight] = useState(weight)
  const [localReps, setLocalReps] = useState(reps)

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeight = parseInt(e.target.value) || 0
    setLocalWeight(newWeight)
    onUpdate(id, newWeight, localReps)
  }

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReps = parseInt(e.target.value) || 0
    setLocalReps(newReps)
    onUpdate(id, localWeight, newReps)
  }

  return (
    <li className="flex items-center justify-between py-2 border-b border-gray-200">
      <div className="flex items-center">
        <button onClick={() => onToggle(id)} className="mr-2">
          {completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-500" />
          )}
        </button>
        <span className={completed ? 'line-through text-gray-500' : ''}>
          {text}
        </span>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          placeholder="Weight"
          value={localWeight === 0 ? '' : localWeight}
          onChange={handleWeightChange}
          className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        />
        <input
          type="number"
          placeholder="Reps"
          value={localReps === 0 ? '' : localReps}
          onChange={handleRepsChange}
          className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        />
        <button onClick={() => onDelete(id)}>
          <Trash2 className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </li>
  )
}

export default TodoItem
