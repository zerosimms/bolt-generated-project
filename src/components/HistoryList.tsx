import React, { useState } from 'react'
import { Trash2, Edit } from 'lucide-react'

interface HistoryListProps {
  history: any[]
  onDeleteHistory: (index: number) => void
  onUpdateHistory: (index: number, updatedExercise: any) => void
  weightUnit: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onDeleteHistory, onUpdateHistory, weightUnit }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedExercise, setEditedExercise] = useState<any>(null)

  const handleEditClick = (index: number, exercise: any) => {
    setEditingIndex(index)
    setEditedExercise({ ...exercise })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedExercise({ ...editedExercise, title: e.target.value })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedExercise({ ...editedExercise, day: e.target.value })
  }

  const handleSetChange = (setIndex: number, field: string, value: any) => {
    if (!editedExercise) return;
    const updatedSets = [...editedExercise.sets]
    updatedSets[setIndex][field] = value
    setEditedExercise({ ...editedExercise, sets: updatedSets })
  }

  const handleSaveClick = (index: number) => {
    if (!editedExercise) return;
    onUpdateHistory(index, editedExercise)
    setEditingIndex(null)
    setEditedExercise(null)
  }

  const handleCancelClick = () => {
    setEditingIndex(null)
    setEditedExercise(null)
  }

  return (
    <ul>
      {history.map((exercise, index) => (
        <li key={index} className="py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {editingIndex === index ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editedExercise.title || ''}
                  onChange={handleTitleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                <input
                  type="date"
                  value={editedExercise.day ? new Date(editedExercise.day).toISOString().split('T')[0] : ''}
                  onChange={handleDateChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                />
                {editedExercise.sets && editedExercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center mb-2">
                    <input
                      type="number"
                      placeholder="Weight"
                      value={set.weight || ''}
                      onChange={(e) => handleSetChange(setIndex, 'weight', parseInt(e.target.value) || 0)}
                      className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={set.reps || ''}
                      onChange={(e) => handleSetChange(setIndex, 'reps', parseInt(e.target.value) || 0)}
                      className="shadow appearance-none border rounded w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-semibold text-gray-800 dark:text-gray-100">{exercise.title}</div>
            )}

            <div className="flex">
              {editingIndex === index ? (
                <>
                  <button
                    onClick={() => handleSaveClick(index)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEditClick(index, exercise)}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none mr-2"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => onDeleteHistory(index)} className="text-red-500 hover:text-red-700 focus:outline-none">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <ul>
            {exercise.sets.map((set, setIndex) => (
              <li key={setIndex} className="ml-4 text-gray-700 dark:text-gray-300">
                {new Date(exercise.day).toLocaleDateString()} - {set.weight} {weightUnit} x {set.reps} reps
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default HistoryList
