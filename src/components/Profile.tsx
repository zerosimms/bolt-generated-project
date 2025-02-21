import React, { useState, useEffect } from 'react'
import { Moon, Sun, Trash2 } from 'lucide-react'
import Select from 'react-select'

interface ProfileProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const initialEquipmentOptions = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'pullupBar', label: 'Pull-up Bar' },
  { value: 'resistanceBands', label: 'Resistance Bands' },
  { value: 'bench', label: 'Bench' },
  { value: 'squatRack', label: 'Squat Rack' },
  { value: 'cableMachine', label: 'Cable Machine' },
  { value: 'legPress', label: 'Leg Press' },
  { value: 'treadmill', label: 'Treadmill' },
  { value: 'exerciseBike', label: 'Exercise Bike' },
  { value: 'yogaMat', label: 'Yoga Mat' },
  { value: 'foamRoller', label: 'Foam Roller' },
  { value: 'none', label: 'None' },
];

const Profile: React.FC<ProfileProps> = ({ darkMode, toggleDarkMode }) => {
  const [weight, setWeight] = useState<string>(localStorage.getItem('weight') || '');
  const [age, setAge] = useState<string>(localStorage.getItem('age') || '');
  const [weightUnit, setWeightUnit] = useState<string>(localStorage.getItem('weightUnit') || 'lbs');
  const [homeEquipment, setHomeEquipment] = useState<any[]>(() => {
    const storedEquipment = localStorage.getItem('homeEquipment');
    return storedEquipment ? JSON.parse(storedEquipment) : [];
  });
  const [gymEquipment, setGymEquipment] = useState<any[]>(() => {
    const storedEquipment = localStorage.getItem('gymEquipment');
    return storedEquipment ? JSON.parse(storedEquipment) : [];
  });
  const [customHomeEquipment, setCustomHomeEquipment] = useState('');
  const [customGymEquipment, setCustomGymEquipment] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState(() => {
    const storedCustomOptions = localStorage.getItem('customEquipmentOptions');
    return storedCustomOptions ? JSON.parse(storedCustomOptions) : initialEquipmentOptions;
  });
  const [customExercises, setCustomExercises] = useState<any[]>(() => {
    const storedCustomExercises = localStorage.getItem('customExercises');
    return storedCustomExercises ? JSON.parse(storedCustomExercises) : [];
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (weight !== '') {
      localStorage.setItem('weight', weight.toString());
    }
    if (age !== '') {
      localStorage.setItem('age', age.toString());
    }

    localStorage.setItem('homeEquipment', JSON.stringify(homeEquipment));
    localStorage.setItem('gymEquipment', JSON.stringify(gymEquipment));
    localStorage.setItem('customEquipmentOptions', JSON.stringify(equipmentOptions));
    localStorage.setItem('customExercises', JSON.stringify(customExercises));
  }, [weight, age, homeEquipment, gymEquipment, equipmentOptions, customExercises]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle the selected file (implementation needed)
      console.log('Selected file:', file);
    }
  };

  const clearCacheAndLocalStorage = () => {
    if (window.confirm("Are you sure you want to clear all cache and local storage? This action is irreversible.")) {
      localStorage.clear();
      caches.keys().then(keys => {
        keys.forEach(key => {
          caches.delete(key);
        });
      }).then(() => {
        alert('Cache and local storage cleared successfully! Please refresh the page.');
        window.location.reload();
      });
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  };

  const handleWeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWeightUnit = e.target.value;
    localStorage.setItem('weightUnit', newWeightUnit);
    setWeightUnit(newWeightUnit);

    // Dispatch a storage event to notify other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'weightUnit',
      newValue: newWeightUnit,
      oldValue: localStorage.getItem('weightUnit'),
      storageArea: localStorage,
    }));
  };

  const handleHomeEquipmentChange = (selectedOptions: any) => {
    setHomeEquipment(selectedOptions || []);
  };

  const handleGymEquipmentChange = (selectedOptions: any) => {
    setGymEquipment(selectedOptions || []);
  };

  const handleAddHomeEquipment = () => {
    if (customHomeEquipment.trim() !== '') {
      const newEquipment = { value: customHomeEquipment.toLowerCase().replace(/\s/g, ''), label: customHomeEquipment };
      setEquipmentOptions([...equipmentOptions, newEquipment]);
      setCustomHomeEquipment('');
    }
  };

  const handleAddGymEquipment = () => {
    if (customGymEquipment.trim() !== '') {
      const newEquipment = { value: customGymEquipment.toLowerCase().replace(/\s/g, ''), label: customGymEquipment };
      setEquipmentOptions([...equipmentOptions, newEquipment]);
      setCustomGymEquipment('');
    }
  };

  const handleDeleteCustomExercise = (exerciseToDelete: any) => {
    const updatedExercises = customExercises.filter(exercise => exercise.value !== exerciseToDelete.value);
    setCustomExercises(updatedExercises);
    localStorage.setItem('customExercises', JSON.stringify(updatedExercises));

    // Dispatch a storage event to notify other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'customExercises', newValue: JSON.stringify(updatedExercises), oldValue: JSON.stringify(customExercises), storageArea: localStorage }));
  };


  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Profile</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-700 dark:text-gray-300">Theme</p>
          <button onClick={toggleDarkMode} className="focus:outline-none">
            {darkMode ? <Sun className="h-6 w-6 text-gray-100" /> : <Moon className="h-6 w-6 text-gray-800" />}
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="weight" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Weight ({weightUnit})</label>
          <input
            type="number"
            id="weight"
            placeholder={`Enter your weight in ${weightUnit}`}
            value={weight}
            onChange={handleWeightChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="weightUnit" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Weight Unit</label>
          <select
            id="weightUnit"
            value={weightUnit}
            onChange={handleWeightUnitChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="lbs">lbs</option>
            <option value="kgs">kgs</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Age</label>
          <input
            type="number"
            id="age"
            placeholder="Enter your age"
            value={age}
            onChange={handleAgeChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Home Equipment</label>
          <Select
            isMulti
            options={equipmentOptions}
            onChange={handleHomeEquipmentChange}
            value={homeEquipment}
            className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="flex mt-2">
            <input
              type="text"
              placeholder="Add custom equipment"
              value={customHomeEquipment}
              onChange={(e) => setCustomHomeEquipment(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              onClick={handleAddHomeEquipment}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Gym Equipment</label>
          <Select
            isMulti
            options={equipmentOptions}
            onChange={handleGymEquipmentChange}
            value={gymEquipment}
            className="shadow appearance-none border rounded w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="flex mt-2">
            <input
              type="text"
              placeholder="Add custom equipment"
              value={customGymEquipment}
              onChange={(e) => setCustomGymEquipment(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline mr-2"
            />
            <button
              onClick={handleAddGymEquipment}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Custom Exercises</label>
          <ul>
            {customExercises.map((exercise, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span>{exercise.label}</span>
                <button onClick={() => handleDeleteCustomExercise(exercise)} className="text-red-500 hover:text-red-700 focus:outline-none">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label htmlFor="hevy-import" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
            Import from Hevy
          </label>
          <input
            type="file"
            id="hevy-import"
            accept=".csv, .json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <button
          onClick={clearCacheAndLocalStorage}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Clear Cache & Local Storage
        </button>
        {/* Add profile content here */}
      </div>
    </div>
  )
}

export default Profile
