import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Set {
  weight: number
  reps: number
  done: boolean
}

interface Exercise {
  id: string
  title: string
  sets: Set[]
  day: string
}

const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const storedExercises = localStorage.getItem('exercises')
    return storedExercises ? JSON.parse(storedExercises) : []
  });

  const [history, setHistory] = useState<Exercise[]>(() => {
    const storedHistory = localStorage.getItem('history')
    return storedHistory ? JSON.parse(storedHistory) : []
  });

  const [weightUnit, setWeightUnit] = useState<string>(localStorage.getItem('weightUnit') || 'lbs');

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises))
    localStorage.setItem('history', JSON.stringify(history))
  }, [exercises, history])

  useEffect(() => {
    const handleStorageChange = () => {
      setWeightUnit(localStorage.getItem('weightUnit') || 'lbs');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to sort history by date
  const sortHistory = (historyArray: Exercise[]): Exercise[] => {
    return [...historyArray].sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());
  };

  useEffect(() => {
    // Sync history with exercises on every change
    setHistory(prevHistory => {
      // Remove exercises from history if they no longer exist in exercises
      const updatedHistory = prevHistory.filter(historyItem =>
        exercises.some(exercise => exercise.id === historyItem.id)
      );

      // Update exercise details in history if they have been edited
      const syncedHistory = updatedHistory.map(historyItem => {
        const correspondingExercise = exercises.find(exercise => exercise.id === historyItem.id);
        if (correspondingExercise) {
          return {
            ...historyItem,
            title: correspondingExercise.title,
            sets: historyItem.sets.map(set => {
              const correspondingSet = correspondingExercise.sets.find(exSet => exSet.weight === set.weight && exSet.reps === set.reps);
              return correspondingSet ? { ...set, weight: correspondingSet.weight, reps: correspondingSet.reps } : set;
            }),
            day: correspondingExercise.day,
          };
        }
        return historyItem;
      });

      return sortHistory(syncedHistory);
    });
  }, [exercises]);

  useEffect(() => {
    setExercises(prevExercises => {
      return prevExercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          weight: set.weight,
        })),
      }));
    });
  }, []);

  const addExercise = (title: string, selectedDay: string) => {
    const newExercise: Exercise = {
      id: uuidv4(),
      title,
      sets: [{ weight: 0, reps: 0, done: false }],
      day: selectedDay,
    }
    setExercises([...exercises, newExercise])
  }

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  const updateSet = (
    exerciseId: string,
    setIndex: number,
    weight: number,
    reps: number,
    done: boolean
  ) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedSets = [...exercise.sets];
          updatedSets[setIndex] = { weight: Number(weight), reps: Number(reps), done: false }; // Always set done to false on edit
          return { ...exercise, sets: updatedSets };
        }
        return exercise
      })
    )
  }

  const addSet = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, sets: [...exercise.sets, { weight: 0, reps: 0, done: false }] }
        }
        return exercise
      })
    )
  }

  const toggleSetDone = (exerciseId: string, setIndex: number, done: boolean) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedSets = [...exercise.sets]
          updatedSets[setIndex] = { ...updatedSets[setIndex], done: done }
          const updatedExercise = { ...exercise, sets: updatedSets };

          if (done) {
            // Find if the exercise already exists in history
            const existingHistoryIndex = history.findIndex(
              (h) => h.id === exerciseId && h.title === exercise.title && h.day === exercise.day
            );

            if (existingHistoryIndex !== -1) {
              // Update the existing history item by appending the new set
              setHistory((prevHistory) => {
                const newHistory = [...prevHistory];
                const existingExercise = newHistory[existingHistoryIndex];
                newHistory[existingHistoryIndex] = {
                  ...existingExercise,
                  sets: [...existingExercise.sets, updatedExercise.sets[setIndex]],
                };
                return sortHistory(newHistory);
              });
            } else {
              // Copy the completed set to history
              setHistory((prevHistory) => {
                const newHistory = [...prevHistory,
                  {
                    ...updatedExercise,
                    sets: [updatedExercise.sets[setIndex]],
                    day: exercise.day, // Use exercise day for history
                  }
                ];
                return sortHistory(newHistory);
              });
            }
          }
          return updatedExercise;
        }
        return exercise
      })
    )
  }

  const deleteSet = (exerciseId: string, setIndex: number) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          const updatedSets = [...exercise.sets]
          updatedSets.splice(setIndex, 1)
          return { ...exercise, sets: updatedSets }
        }
        return exercise
      })
    )
  }

  const deleteHistory = (index: number) => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory]
      newHistory.splice(index, 1)
      return newHistory
    })
  }

  const updateHistory = (index: number, updatedExercise: Exercise) => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory]
      newHistory[index] = updatedExercise
      return sortHistory(newHistory);
    });

    // Update the corresponding exercise in the exercises list
    setExercises(prevExercises => {
      return prevExercises.map(exercise => {
        if (exercise.id === updatedExercise.id) {
          return {
            ...exercise,
            title: updatedExercise.title,
            sets: updatedExercise.sets,
            day: updatedExercise.day,
          };
        }
        return exercise;
      });
    });
  }

  return {
    exercises,
    addExercise,
    deleteExercise,
    updateSet,
    addSet,
    toggleSetDone,
    deleteSet,
    history,
    deleteHistory,
    updateHistory,
    weightUnit,
  }
}

export default useExercises
export type { Exercise }
