import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import ExerciseSelector from './ExerciseSelector'

interface ExerciseFormProps {
  onAdd: (title: string) => void
  popularExercises: string[]
  hidden?: boolean
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onAdd, popularExercises, hidden }) => {
  const [title, setTitle] = useState('')

  const handleExerciseSelect = (exercises: string[]) => {
    exercises.forEach((exercise) => {
      onAdd(exercise)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title)
      setTitle('')
    }
  }

  return (
    <div className={hidden ? 'hidden' : ''}>
      <ExerciseSelector popularExercises={popularExercises} onAdd={handleExerciseSelect} className="mt-4" />
    </div>
  )
}

export default ExerciseForm
