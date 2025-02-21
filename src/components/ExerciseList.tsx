import React from 'react'
import ExerciseItem from './ExerciseItem'

interface ExerciseListProps {
  exercises: any[]
  deleteExercise: (id: string) => void
  updateSet: (exerciseId: string, setIndex: number, weight: number, reps: number, done: boolean) => void
  addSet: (exerciseId: string) => void
  toggleSetDone: (exerciseId: string, setIndex: number, done: boolean) => void
  deleteSet: (exerciseId: string, setIndex: number) => void
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  deleteExercise,
  updateSet,
  addSet,
  toggleSetDone,
  deleteSet,
}) => {
  return (
    <ul className="mt-4 space-y-4">
      {exercises.map((exercise) => (
        <ExerciseItem
          key={exercise.id}
          id={exercise.id}
          title={exercise.title}
          sets={exercise.sets}
          onDelete={deleteExercise}
          onUpdateSet={updateSet}
          onAddSet={addSet}
          onToggleSetDone={toggleSetDone}
          onDeleteSet={deleteSet}
        />
      ))}
    </ul>
  )
}

export default ExerciseList
