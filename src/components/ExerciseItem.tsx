import React from 'react'
import SetItem from './SetItem'
import { Trash2, PlusCircle } from 'lucide-react'

interface Set {
  weight: number
  reps: number
  done: boolean
}

interface ExerciseItemProps {
  id: string
  title: string
  sets: Set[]
  onDelete: (id: string) => void
  onUpdateSet: (exerciseId: string, setIndex: number, weight: number, reps: number, done: boolean) => void
  onAddSet: (exerciseId: string) => void
  onToggleSetDone: (exerciseId: string, setIndex: number, done: boolean) => void
  onDeleteSet: (exerciseId: string, setIndex: number) => void
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  id,
  title,
  sets,
  onDelete,
  onUpdateSet,
  onAddSet,
  onToggleSetDone,
  onDeleteSet,
}) => {
  const allSetsDone = sets.every((set) => set.done)

  return (
    <li className={`py-3 px-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 ${allSetsDone ? 'bg-green-50 dark:bg-green-700' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold text-gray-800 dark:text-gray-100">{title}</div>
        <button onClick={() => onDelete(id)} className="text-red-500 hover:text-red-700 focus:outline-none">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {sets.map((set, index) => (
        <SetItem
          key={index}
          weight={set.weight}
          reps={set.reps}
          done={set.done}
          onUpdate={(weight, reps, done) => onUpdateSet(id, index, weight, reps, done)}
          onToggleDone={(done) => onToggleSetDone(id, index, done)}
          onDelete={() => onDeleteSet(id, index)}
        />
      ))}
      <button
        onClick={() => onAddSet(id)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-2 text-sm"
      >
        <PlusCircle className="h-4 w-4 mr-2 inline-block" />
        Add Set
      </button>
    </li>
  )
}

export default ExerciseItem
