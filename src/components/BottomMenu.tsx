import React from 'react'
import { Clock, User, BarChart, NotebookPen, Dumbbell } from 'lucide-react'

interface BottomMenuProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const BottomMenu: React.FC<BottomMenuProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2">
      <div className="container mx-auto flex justify-around">
        <button
          onClick={() => onTabChange('trainer')}
          className={`flex flex-col items-center text-gray-700 dark:text-gray-300 focus:outline-none ${
            activeTab === 'trainer' ? 'text-primary' : ''
          }`}
        >
          <NotebookPen className="h-6 w-6 mb-1" />
          Trainer
        </button>
        <button
          onClick={() => onTabChange('gym')}
          className={`flex flex-col items-center text-gray-700 dark:text-gray-300 focus:outline-none ${
            activeTab === 'gym' ? 'text-primary' : ''
          }`}
        >
          <Dumbbell className="h-6 w-6 mb-1" />
          Gym
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center text-gray-700 dark:text-gray-300 focus:outline-none ${
            activeTab === 'history' ? 'text-primary' : ''
          }`}
        >
          <Clock className="h-6 w-6 mb-1" />
          History
        </button>
        <button
          onClick={() => onTabChange('stats')}
          className={`flex flex-col items-center text-gray-700 dark:text-gray-300 focus:outline-none ${
            activeTab === 'stats' ? 'text-primary' : ''
          }`}
        >
          <BarChart className="h-6 w-6 mb-1" />
          Stats
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center text-gray-700 dark:text-gray-300 focus:outline-none ${
            activeTab === 'profile' ? 'text-primary' : ''
          }`}
        >
          <User className="h-6 w-6 mb-1" />
          Profile
        </button>
      </div>
    </div>
  )
}

export default BottomMenu
