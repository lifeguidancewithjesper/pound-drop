export interface QuickWorkout {
  id: string;
  name: string;
  duration: string;
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'Walking' | 'HIIT';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  exercises: WorkoutExercise[];
  caloriesBurned: number;
  noEquipment: boolean;
  recommended?: boolean;
}

export interface WorkoutExercise {
  name: string;
  duration: string;
  reps?: string;
}

export const quickWorkouts: QuickWorkout[] = [
  // WALKING WORKOUTS (Pound Drop Method: 30 min minimum)
  {
    id: 'w0',
    name: 'Low-Intensity Walking',
    duration: '30 min',
    category: 'Walking',
    difficulty: 'Beginner',
    description: 'Walk slowly and pay attention to your surroundings. Be present in the moment. This helps your adrenals rejuvenate and reduces stress while providing gentle body movement.',
    exercises: [
      { name: 'Slow, mindful walk - focus on breathing', duration: '5 min' },
      { name: 'Continue slow pace - notice surroundings', duration: '20 min' },
      { name: 'Gentle cool-down walk', duration: '5 min' },
    ],
    caloriesBurned: 90,
    noEquipment: true,
    recommended: true,
  },
  {
    id: 'w1',
    name: 'Morning Power Walk',
    duration: '15 min',
    category: 'Walking',
    difficulty: 'Beginner',
    description: 'Brisk neighborhood walk to start your day',
    exercises: [
      { name: 'Warm-up walk (slow pace)', duration: '3 min' },
      { name: 'Brisk walk (moderate pace)', duration: '10 min' },
      { name: 'Cool-down walk (slow pace)', duration: '2 min' },
    ],
    caloriesBurned: 75,
    noEquipment: true,
  },
  {
    id: 'w2',
    name: 'Interval Walking',
    duration: '12 min',
    category: 'Walking',
    difficulty: 'Intermediate',
    description: 'Alternating pace for extra calorie burn',
    exercises: [
      { name: 'Warm-up walk', duration: '2 min' },
      { name: 'Fast walk (1 min) + Slow walk (1 min)', duration: '8 min', reps: '4 rounds' },
      { name: 'Cool-down walk', duration: '2 min' },
    ],
    caloriesBurned: 85,
    noEquipment: true,
  },

  // QUICK HIIT WORKOUTS
  {
    id: 'h1',
    name: '10-Minute Fat Burner',
    duration: '10 min',
    category: 'HIIT',
    difficulty: 'Intermediate',
    description: 'High-intensity intervals for maximum calorie burn',
    exercises: [
      { name: 'Jumping Jacks', duration: '30 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'High Knees', duration: '30 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Burpees', duration: '30 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Mountain Climbers', duration: '30 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Repeat 2 rounds', duration: '6 min' },
    ],
    caloriesBurned: 120,
    noEquipment: true,
  },
  {
    id: 'h2',
    name: 'Quick Cardio Blast',
    duration: '12 min',
    category: 'HIIT',
    difficulty: 'Beginner',
    description: 'Beginner-friendly cardio intervals',
    exercises: [
      { name: 'March in place', duration: '1 min' },
      { name: 'Jumping Jacks', duration: '30 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Step-touches', duration: '1 min' },
      { name: 'High Knees (light)', duration: '30 sec' },
      { name: 'Rest', duration: '30 sec' },
      { name: 'Repeat 3 rounds', duration: '8 min' },
    ],
    caloriesBurned: 90,
    noEquipment: true,
  },

  // STRENGTH WORKOUTS
  {
    id: 's1',
    name: 'Bodyweight Strength',
    duration: '15 min',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Full-body strength using only bodyweight',
    exercises: [
      { name: 'Warm-up (arm circles, leg swings)', duration: '2 min' },
      { name: 'Push-ups', duration: '1 min', reps: '10-15 reps' },
      { name: 'Squats', duration: '1 min', reps: '15-20 reps' },
      { name: 'Plank', duration: '30 sec' },
      { name: 'Lunges', duration: '1 min', reps: '10 each leg' },
      { name: 'Rest', duration: '1 min' },
      { name: 'Repeat circuit 2 times', duration: '9 min' },
    ],
    caloriesBurned: 110,
    noEquipment: true,
  },
  {
    id: 's2',
    name: 'Core & Arms Quick',
    duration: '10 min',
    category: 'Strength',
    difficulty: 'Beginner',
    description: 'Target core and upper body',
    exercises: [
      { name: 'Plank', duration: '30 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Wall push-ups', duration: '45 sec', reps: '12-15 reps' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Bicycle crunches', duration: '45 sec' },
      { name: 'Rest', duration: '15 sec' },
      { name: 'Repeat 3 rounds', duration: '6 min' },
    ],
    caloriesBurned: 70,
    noEquipment: true,
  },
  {
    id: 's3',
    name: 'Lower Body Burner',
    duration: '12 min',
    category: 'Strength',
    difficulty: 'Intermediate',
    description: 'Legs and glutes focused workout',
    exercises: [
      { name: 'Bodyweight Squats', duration: '1 min', reps: '20 reps' },
      { name: 'Walking Lunges', duration: '1 min', reps: '10 each leg' },
      { name: 'Glute Bridges', duration: '1 min', reps: '15-20 reps' },
      { name: 'Wall Sit', duration: '30 sec' },
      { name: 'Rest', duration: '1 min' },
      { name: 'Repeat 3 rounds', duration: '10 min' },
    ],
    caloriesBurned: 95,
    noEquipment: true,
  },

  // FLEXIBILITY & RECOVERY
  {
    id: 'f1',
    name: 'Morning Stretch',
    duration: '10 min',
    category: 'Flexibility',
    difficulty: 'Beginner',
    description: 'Gentle stretches to start your day',
    exercises: [
      { name: 'Neck rolls', duration: '1 min' },
      { name: 'Shoulder rolls', duration: '1 min' },
      { name: 'Cat-Cow stretch', duration: '2 min' },
      { name: 'Seated forward fold', duration: '2 min' },
      { name: 'Hip flexor stretch', duration: '2 min' },
      { name: 'Child\'s pose', duration: '2 min' },
    ],
    caloriesBurned: 35,
    noEquipment: true,
  },
  {
    id: 'f2',
    name: 'Evening Wind-Down',
    duration: '12 min',
    category: 'Flexibility',
    difficulty: 'Beginner',
    description: 'Relaxing stretches before bed',
    exercises: [
      { name: 'Gentle neck stretches', duration: '2 min' },
      { name: 'Shoulder and arm stretches', duration: '2 min' },
      { name: 'Seated spinal twist', duration: '2 min' },
      { name: 'Butterfly stretch', duration: '2 min' },
      { name: 'Legs up the wall', duration: '3 min' },
      { name: 'Deep breathing', duration: '1 min' },
    ],
    caloriesBurned: 30,
    noEquipment: true,
  },

  // CARDIO WORKOUTS
  {
    id: 'c1',
    name: 'Dance Cardio Fun',
    duration: '15 min',
    category: 'Cardio',
    difficulty: 'Beginner',
    description: 'Fun dance moves to get your heart pumping',
    exercises: [
      { name: 'Warm-up (march, side steps)', duration: '2 min' },
      { name: 'Grapevine steps', duration: '2 min' },
      { name: 'Knee lifts with arms', duration: '2 min' },
      { name: 'Side-to-side hops', duration: '2 min' },
      { name: 'Twist and reach', duration: '2 min' },
      { name: 'Freestyle dance', duration: '3 min' },
      { name: 'Cool-down stretch', duration: '2 min' },
    ],
    caloriesBurned: 100,
    noEquipment: true,
  },
  {
    id: 'c2',
    name: 'Stair Climber',
    duration: '10 min',
    category: 'Cardio',
    difficulty: 'Intermediate',
    description: 'Use stairs for an effective cardio workout',
    exercises: [
      { name: 'Warm-up (march in place)', duration: '1 min' },
      { name: 'Walk up stairs (normal pace)', duration: '2 min' },
      { name: 'Walk up stairs (faster pace)', duration: '2 min' },
      { name: 'Step-ups on bottom stair', duration: '2 min' },
      { name: 'Walk up stairs (one at a time)', duration: '2 min' },
      { name: 'Cool-down walk', duration: '1 min' },
    ],
    caloriesBurned: 95,
    noEquipment: false,
  },
];
