import React, { useState, useEffect } from 'react'
import Select from 'react-select'

interface ExerciseSelectorProps {
  popularExercises: string[]
  onAdd: (selectedExercises: string[]) => void
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ popularExercises, onAdd }) => {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [customOptions, setCustomOptions] = useState<any[]>(() => {
    const storedCustomOptions = localStorage.getItem('customExercises');
    return storedCustomOptions ? JSON.parse(storedCustomOptions) : [];
  });

  const options = popularExercises.map((exercise) => ({
    value: exercise,
    label: exercise,
  }))

  useEffect(() => {
    localStorage.setItem('customExercises', JSON.stringify(customOptions));
  }, [customOptions]);

  const addCustomOption = {
    value: 'add_custom',
    label: '+ Add Custom Exercise',
  };


  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#E5E7EB' : 'white', // Light background
      border: '1px solid #D1D5DB',
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(79, 70, 229, 0.25)' : null,
      '&:hover': {
        borderColor: '#4F46E5',
      },
      color: '#374151', // Dark text
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#E5E7EB' : 'white', // Light background
      color: '#374151', // Dark text
      '&:active': {
        backgroundColor: '#4F46E5',
        color: 'white',
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#E0E7FF',
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#374151',
    }),
  }


  const handleSelectChange = (selectedOptions: any) => {
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option: { value: any }) => option.value);

      if (selectedValues.includes('add_custom')) {
        // Handle "Add Custom Exercise"
        const customTitle = prompt('Enter custom exercise title:');
        if (customTitle && customTitle.trim() !== '') {
          onAdd([customTitle]);
          const newCustomOption = { value: customTitle, label: customTitle };
          setCustomOptions(prevOptions => {
            const updatedOptions = [...prevOptions, newCustomOption];
            localStorage.setItem('customExercises', JSON.stringify(updatedOptions));
            return updatedOptions;
          });

        }
        setSelectedValue(null);
      } else {
        // Handle regular exercise selections
        const selectedExercises = selectedValues.filter(value => value !== 'add_custom');
        onAdd(selectedExercises);
        setSelectedValue(null);
      }
    } else {
      onAdd([])
      setSelectedValue(null)
    }
  }

  const allOptions = [addCustomOption, ...customOptions, ...options];


  return (
    <div className="mb-4">
      <Select
        isMulti
        options={allOptions}
        onChange={handleSelectChange}
        placeholder="Select Exercises"
        styles={customStyles}
        className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={selectedValue}
      />
    </div>
  )
}

export default ExerciseSelector
