import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useExercises from '../hooks/useExercises';

const Stats = () => {
  const { history } = useExercises();
  const [weightUnit, setWeightUnit] = useState<string>(localStorage.getItem('weightUnit') || 'lbs');
  const [filteredHistory, setFilteredHistory] = useState(history);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newFilteredHistory = history.filter(exercise => new Date(exercise.day) >= lastWeek);
    setFilteredHistory(newFilteredHistory);
  }, [history]);

  // Calculate total exercises completed per week
  const weeklyExercisesData = filteredHistory.reduce((acc: any, exercise: any) => {
    const week = new Date(exercise.day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); // Simplified week identifier
    if (!acc[week]) {
      acc[week] = 0;
    }
    acc[week]++;
    return acc;
  }, {});

  const totalExercisesData = Object.entries(weeklyExercisesData).map(([name, exercises]) => ({ name, exercises })).reverse();

  // Calculate weight lifted over time (simplified - total weight per day)
  const weightLiftedData = filteredHistory.reduce((acc: any, exercise: any) => {
    const day = new Date(exercise.day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const totalWeight = exercise.sets.reduce((sum: number, set: any) => sum + (set.weight * set.reps), 0);
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += totalWeight;
    return acc;
  }, {});

  const weightLiftedArray = Object.entries(weightLiftedData).map(([name, weight]) => ({ name, weight })).reverse();

  // Calculate most frequent exercises
  const exerciseFrequency: { [key: string]: number } = filteredHistory.reduce((acc: any, exercise: any) => {
    if (!acc[exercise.title]) {
      acc[exercise.title] = 0;
    }
    acc[exercise.title]++;
    return acc;
  }, {});

  const sortedExercises = Object.entries(exerciseFrequency).sort(([, a], [, b]) => b - a);
  const topExercises = sortedExercises.slice(0, 5);

  const pieChartData = topExercises.map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#800080'];

    // Calculate summary stats
    const totalWeightLifted = filteredHistory.reduce((sum: number, exercise: any) => {
      return sum + exercise.sets.reduce((setSum: number, set: any) => setSum + (set.weight * set.reps), 0);
    }, 0);

    const totalExercises = filteredHistory.length;

    const totalReps = filteredHistory.reduce((sum: number, exercise: any) => {
      return sum + exercise.sets.reduce((setSum: number, set: any) => setSum + set.reps, 0);
    }, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Stats</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Weight Lifted</h3>
            <p className="text-gray-600 dark:text-gray-400">{totalWeightLifted} {weightUnit}</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Exercises</h3>
            <p className="text-gray-600 dark:text-gray-400">{totalExercises}</p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Reps</h3>
            <p className="text-gray-600 dark:text-gray-400">{totalReps}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Total Exercises Completed
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalExercisesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="exercises" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Weight Lifted Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightLiftedArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Most Frequent Exercises
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
