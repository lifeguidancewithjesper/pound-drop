// Natural bodyweight exercises requiring minimal to no equipment
export interface NaturalExercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'core';
  equipment: 'none' | 'minimal';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  reps?: string;
  duration?: string;
  muscles: string[];
}

export const naturalExercises: NaturalExercise[] = [
  // CARDIO - No Equipment
  {
    id: 'walk',
    name: 'Walking',
    category: 'cardio',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Walk at a comfortable pace, focusing on natural movement and breathing',
    duration: '20-30 min',
    muscles: ['Legs', 'Core']
  },
  {
    id: 'march',
    name: 'Marching in Place',
    category: 'cardio',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Lift knees alternately, swing arms naturally',
    duration: '2-3 min',
    muscles: ['Legs', 'Core']
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Jump while spreading legs and raising arms overhead',
    reps: '15-20',
    muscles: ['Full Body']
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'cardio',
    equipment: 'none',
    difficulty: 'intermediate',
    description: 'Run in place lifting knees high toward chest',
    duration: '30-60 sec',
    muscles: ['Legs', 'Core']
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    category: 'cardio',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Jog in place, kicking heels back toward glutes',
    duration: '30-60 sec',
    muscles: ['Legs', 'Glutes']
  },

  // STRENGTH - Bodyweight
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    category: 'strength',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Stand with feet shoulder-width apart, lower hips back and down, keep chest up',
    reps: '10-15',
    muscles: ['Legs', 'Glutes', 'Core']
  },
  {
    id: 'wall-push',
    name: 'Wall Push-Ups',
    category: 'strength',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Stand arm\'s length from wall, lean forward and push back',
    reps: '10-15',
    muscles: ['Chest', 'Arms', 'Shoulders']
  },
  {
    id: 'push-ups',
    name: 'Push-Ups',
    category: 'strength',
    equipment: 'none',
    difficulty: 'intermediate',
    description: 'Hands shoulder-width apart, lower chest to ground, push back up',
    reps: '8-12',
    muscles: ['Chest', 'Arms', 'Core']
  },
  {
    id: 'lunges',
    name: 'Forward Lunges',
    category: 'strength',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Step forward, lower back knee toward ground, return to start',
    reps: '10-12 each leg',
    muscles: ['Legs', 'Glutes']
  },
  {
    id: 'chair-dips',
    name: 'Chair Dips',
    category: 'strength',
    equipment: 'minimal',
    difficulty: 'intermediate',
    description: 'Use sturdy chair, hands on edge, lower body down and push back up',
    reps: '8-12',
    muscles: ['Triceps', 'Shoulders']
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'strength',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Lie on back, knees bent, lift hips up, squeeze glutes at top',
    reps: '12-15',
    muscles: ['Glutes', 'Hamstrings', 'Core']
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'strength',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Stand tall, rise up on toes, lower slowly',
    reps: '15-20',
    muscles: ['Calves']
  },

  // CORE - No Equipment
  {
    id: 'plank',
    name: 'Plank Hold',
    category: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Hold body straight on forearms and toes, engage core',
    duration: '20-30 sec',
    muscles: ['Core', 'Shoulders']
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'On hands and knees, extend opposite arm and leg, hold briefly',
    reps: '10 each side',
    muscles: ['Core', 'Back']
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Lie on back, extend opposite arm and leg while keeping lower back pressed down',
    reps: '10 each side',
    muscles: ['Core', 'Hip Flexors']
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'core',
    equipment: 'none',
    difficulty: 'intermediate',
    description: 'In plank position, alternate bringing knees toward chest',
    duration: '30-45 sec',
    muscles: ['Core', 'Shoulders', 'Legs']
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    equipment: 'none',
    difficulty: 'intermediate',
    description: 'Lie on back, alternate elbow to opposite knee in cycling motion',
    reps: '15-20',
    muscles: ['Core', 'Obliques']
  },

  // FLEXIBILITY - No Equipment
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'On hands and knees, alternate arching and rounding your back',
    reps: '8-10',
    muscles: ['Back', 'Spine']
  },
  {
    id: 'standing-quad',
    name: 'Standing Quad Stretch',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Stand on one leg, pull other foot toward glutes, hold 20-30 sec',
    duration: '20-30 sec each leg',
    muscles: ['Quadriceps']
  },
  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Roll shoulders forward and backward in circular motion',
    reps: '10 each direction',
    muscles: ['Shoulders', 'Upper Back']
  },
  {
    id: 'torso-twist',
    name: 'Standing Torso Twist',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Stand with feet hip-width, twist upper body side to side',
    reps: '10-15 each side',
    muscles: ['Core', 'Obliques', 'Back']
  },
  {
    id: 'child-pose',
    name: 'Child\'s Pose',
    category: 'flexibility',
    equipment: 'none',
    difficulty: 'beginner',
    description: 'Kneel, sit back on heels, reach arms forward, relax',
    duration: '30-60 sec',
    muscles: ['Back', 'Shoulders', 'Hips']
  }
];

// Workout plan templates based on fitness level and goals
export interface WorkoutPlan {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'weight-loss' | 'toning' | 'flexibility' | 'general-fitness';
  duration: string;
  exercises: {
    exerciseId: string;
    sets?: number;
    rest?: string;
  }[];
  description: string;
}

export const workoutPlans: WorkoutPlan[] = [
  // BEGINNER - WEIGHT LOSS (30 min)
  {
    id: 'beginner-weight-loss',
    name: 'Beginner Fat Burn',
    level: 'beginner',
    goal: 'weight-loss',
    duration: '30 min',
    description: 'Low-impact cardio and basic movements to burn calories',
    exercises: [
      { exerciseId: 'march', sets: 1, rest: '30 sec' }, // Warm-up: 3 min
      { exerciseId: 'shoulder-rolls', sets: 1, rest: '20 sec' },
      { exerciseId: 'squats', sets: 3, rest: '40 sec' }, // Main: 20 min
      { exerciseId: 'wall-push', sets: 3, rest: '40 sec' },
      { exerciseId: 'jumping-jacks', sets: 3, rest: '40 sec' },
      { exerciseId: 'lunges', sets: 3, rest: '40 sec' },
      { exerciseId: 'butt-kicks', sets: 2, rest: '30 sec' },
      { exerciseId: 'plank', sets: 3, rest: '40 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '40 sec' },
      { exerciseId: 'calf-raises', sets: 2, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 4 min
      { exerciseId: 'standing-quad', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '30 sec' }
    ]
  },

  // BEGINNER - TONING (30 min)
  {
    id: 'beginner-toning',
    name: 'Beginner Body Sculpt',
    level: 'beginner',
    goal: 'toning',
    duration: '30 min',
    description: 'Build strength and tone muscles with bodyweight exercises',
    exercises: [
      { exerciseId: 'march', sets: 1, rest: '30 sec' }, // Warm-up: 3 min
      { exerciseId: 'torso-twist', sets: 1, rest: '20 sec' },
      { exerciseId: 'squats', sets: 4, rest: '45 sec' }, // Main: 22 min
      { exerciseId: 'wall-push', sets: 4, rest: '45 sec' },
      { exerciseId: 'glute-bridge', sets: 4, rest: '45 sec' },
      { exerciseId: 'lunges', sets: 3, rest: '40 sec' },
      { exerciseId: 'plank', sets: 3, rest: '40 sec' },
      { exerciseId: 'bird-dog', sets: 3, rest: '40 sec' },
      { exerciseId: 'calf-raises', sets: 3, rest: '30 sec' },
      { exerciseId: 'dead-bug', sets: 2, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 4 min
      { exerciseId: 'shoulder-rolls', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '30 sec' }
    ]
  },

  // BEGINNER - FLEXIBILITY (30 min)
  {
    id: 'beginner-flexibility',
    name: 'Beginner Stretch & Mobility',
    level: 'beginner',
    goal: 'flexibility',
    duration: '30 min',
    description: 'Gentle stretching to improve flexibility and reduce tension',
    exercises: [
      { exerciseId: 'shoulder-rolls', sets: 2, rest: '20 sec' }, // Warm-up: 4 min
      { exerciseId: 'march', sets: 1, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 4, rest: '30 sec' }, // Main: 22 min
      { exerciseId: 'torso-twist', sets: 4, rest: '30 sec' },
      { exerciseId: 'bird-dog', sets: 3, rest: '30 sec' },
      { exerciseId: 'standing-quad', sets: 4, rest: '30 sec' },
      { exerciseId: 'dead-bug', sets: 3, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 3, rest: '40 sec' },
      { exerciseId: 'glute-bridge', sets: 2, rest: '30 sec' },
      { exerciseId: 'plank', sets: 2, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 2, rest: '60 sec' } // Cool-down: 3 min
    ]
  },

  // BEGINNER - GENERAL FITNESS (30 min)
  {
    id: 'beginner-general',
    name: 'Beginner Full Body',
    level: 'beginner',
    goal: 'general-fitness',
    duration: '30 min',
    description: 'Balanced workout for overall health and fitness',
    exercises: [
      { exerciseId: 'march', sets: 1, rest: '30 sec' }, // Warm-up: 3 min
      { exerciseId: 'shoulder-rolls', sets: 1, rest: '20 sec' },
      { exerciseId: 'squats', sets: 3, rest: '40 sec' }, // Main: 22 min
      { exerciseId: 'wall-push', sets: 3, rest: '40 sec' },
      { exerciseId: 'jumping-jacks', sets: 2, rest: '30 sec' },
      { exerciseId: 'plank', sets: 3, rest: '40 sec' },
      { exerciseId: 'lunges', sets: 3, rest: '40 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '40 sec' },
      { exerciseId: 'bird-dog', sets: 2, rest: '30 sec' },
      { exerciseId: 'butt-kicks', sets: 2, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 4 min
      { exerciseId: 'torso-twist', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '30 sec' }
    ]
  },

  // INTERMEDIATE - WEIGHT LOSS (30 min)
  {
    id: 'intermediate-weight-loss',
    name: 'Intermediate Cardio Burn',
    level: 'intermediate',
    goal: 'weight-loss',
    duration: '30 min',
    description: 'High-energy workout to maximize calorie burn',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, rest: '30 sec' }, // Warm-up: 3 min
      { exerciseId: 'march', sets: 1, rest: '30 sec' },
      { exerciseId: 'high-knees', sets: 4, rest: '30 sec' }, // Main: 23 min
      { exerciseId: 'mountain-climbers', sets: 4, rest: '30 sec' },
      { exerciseId: 'squats', sets: 4, rest: '40 sec' },
      { exerciseId: 'push-ups', sets: 4, rest: '40 sec' },
      { exerciseId: 'lunges', sets: 4, rest: '40 sec' },
      { exerciseId: 'butt-kicks', sets: 3, rest: '30 sec' },
      { exerciseId: 'bicycle-crunches', sets: 3, rest: '30 sec' },
      { exerciseId: 'plank', sets: 3, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 3 min
      { exerciseId: 'standing-quad', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '40 sec' }
    ]
  },

  // INTERMEDIATE - TONING (30 min)
  {
    id: 'intermediate-toning',
    name: 'Intermediate Muscle Builder',
    level: 'intermediate',
    goal: 'toning',
    duration: '30 min',
    description: 'Strengthen and define muscles with challenging exercises',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 1, rest: '30 sec' }, // Warm-up: 2 min
      { exerciseId: 'torso-twist', sets: 1, rest: '20 sec' },
      { exerciseId: 'push-ups', sets: 4, rest: '45 sec' }, // Main: 24 min
      { exerciseId: 'squats', sets: 5, rest: '50 sec' },
      { exerciseId: 'chair-dips', sets: 4, rest: '45 sec' },
      { exerciseId: 'lunges', sets: 4, rest: '45 sec' },
      { exerciseId: 'glute-bridge', sets: 4, rest: '45 sec' },
      { exerciseId: 'bicycle-crunches', sets: 4, rest: '40 sec' },
      { exerciseId: 'plank', sets: 4, rest: '40 sec' },
      { exerciseId: 'mountain-climbers', sets: 2, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 3 min
      { exerciseId: 'shoulder-rolls', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '40 sec' }
    ]
  },

  // INTERMEDIATE - FLEXIBILITY (30 min)
  {
    id: 'intermediate-flexibility',
    name: 'Intermediate Flexibility Flow',
    level: 'intermediate',
    goal: 'flexibility',
    duration: '30 min',
    description: 'Dynamic stretching and mobility work',
    exercises: [
      { exerciseId: 'shoulder-rolls', sets: 2, rest: '20 sec' }, // Warm-up: 3 min
      { exerciseId: 'march', sets: 1, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 5, rest: '30 sec' }, // Main: 24 min
      { exerciseId: 'torso-twist', sets: 5, rest: '30 sec' },
      { exerciseId: 'bird-dog', sets: 4, rest: '30 sec' },
      { exerciseId: 'dead-bug', sets: 4, rest: '30 sec' },
      { exerciseId: 'standing-quad', sets: 4, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 4, rest: '40 sec' },
      { exerciseId: 'plank', sets: 3, rest: '30 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 2, rest: '60 sec' } // Cool-down: 2 min
    ]
  },

  // INTERMEDIATE - GENERAL FITNESS (30 min)
  {
    id: 'intermediate-general',
    name: 'Intermediate Total Body',
    level: 'intermediate',
    goal: 'general-fitness',
    duration: '30 min',
    description: 'Complete workout for strength, cardio, and flexibility',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, rest: '30 sec' }, // Warm-up: 3 min
      { exerciseId: 'torso-twist', sets: 1, rest: '20 sec' },
      { exerciseId: 'push-ups', sets: 4, rest: '45 sec' }, // Main: 23 min
      { exerciseId: 'squats', sets: 4, rest: '45 sec' },
      { exerciseId: 'mountain-climbers', sets: 3, rest: '30 sec' },
      { exerciseId: 'lunges', sets: 4, rest: '45 sec' },
      { exerciseId: 'bicycle-crunches', sets: 3, rest: '30 sec' },
      { exerciseId: 'high-knees', sets: 3, rest: '30 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '40 sec' },
      { exerciseId: 'plank', sets: 3, rest: '40 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 3 min
      { exerciseId: 'standing-quad', sets: 2, rest: '20 sec' },
      { exerciseId: 'child-pose', sets: 1, rest: '40 sec' }
    ]
  },

  // ADVANCED - WEIGHT LOSS (30 min)
  {
    id: 'advanced-weight-loss',
    name: 'Advanced HIIT Burn',
    level: 'advanced',
    goal: 'weight-loss',
    duration: '30 min',
    description: 'High-intensity workout for maximum fat burning',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, rest: '20 sec' }, // Warm-up: 2 min
      { exerciseId: 'high-knees', sets: 5, rest: '20 sec' }, // Main: 25 min
      { exerciseId: 'mountain-climbers', sets: 5, rest: '20 sec' },
      { exerciseId: 'push-ups', sets: 5, rest: '30 sec' },
      { exerciseId: 'squats', sets: 5, rest: '30 sec' },
      { exerciseId: 'butt-kicks', sets: 4, rest: '20 sec' },
      { exerciseId: 'bicycle-crunches', sets: 5, rest: '30 sec' },
      { exerciseId: 'lunges', sets: 4, rest: '30 sec' },
      { exerciseId: 'plank', sets: 4, rest: '30 sec' },
      { exerciseId: 'jumping-jacks', sets: 3, rest: '20 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 2 min
      { exerciseId: 'child-pose', sets: 2, rest: '40 sec' }
    ]
  },

  // ADVANCED - TONING (30 min)
  {
    id: 'advanced-toning',
    name: 'Advanced Strength & Definition',
    level: 'advanced',
    goal: 'toning',
    duration: '30 min',
    description: 'Advanced movements for muscle definition and strength',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, rest: '20 sec' }, // Warm-up: 2 min
      { exerciseId: 'push-ups', sets: 5, rest: '30 sec' }, // Main: 25 min
      { exerciseId: 'squats', sets: 6, rest: '40 sec' },
      { exerciseId: 'chair-dips', sets: 5, rest: '30 sec' },
      { exerciseId: 'lunges', sets: 5, rest: '40 sec' },
      { exerciseId: 'mountain-climbers', sets: 4, rest: '25 sec' },
      { exerciseId: 'glute-bridge', sets: 5, rest: '30 sec' },
      { exerciseId: 'plank', sets: 5, rest: '30 sec' },
      { exerciseId: 'bicycle-crunches', sets: 4, rest: '30 sec' },
      { exerciseId: 'calf-raises', sets: 3, rest: '25 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 2 min
      { exerciseId: 'child-pose', sets: 2, rest: '30 sec' }
    ]
  },

  // ADVANCED - FLEXIBILITY (30 min)
  {
    id: 'advanced-flexibility',
    name: 'Advanced Mobility & Stretch',
    level: 'advanced',
    goal: 'flexibility',
    duration: '30 min',
    description: 'Deep stretching and advanced mobility work',
    exercises: [
      { exerciseId: 'shoulder-rolls', sets: 2, rest: '20 sec' }, // Warm-up: 3 min
      { exerciseId: 'march', sets: 1, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 6, rest: '30 sec' }, // Main: 24 min
      { exerciseId: 'bird-dog', sets: 5, rest: '30 sec' },
      { exerciseId: 'dead-bug', sets: 5, rest: '30 sec' },
      { exerciseId: 'torso-twist', sets: 5, rest: '30 sec' },
      { exerciseId: 'standing-quad', sets: 5, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 4, rest: '45 sec' },
      { exerciseId: 'plank', sets: 3, rest: '30 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '30 sec' },
      { exerciseId: 'child-pose', sets: 3, rest: '60 sec' } // Cool-down: 3 min
    ]
  },

  // ADVANCED - GENERAL FITNESS (30 min)
  {
    id: 'advanced-general',
    name: 'Advanced Athletic Performance',
    level: 'advanced',
    goal: 'general-fitness',
    duration: '30 min',
    description: 'Complete high-intensity workout for peak fitness',
    exercises: [
      { exerciseId: 'jumping-jacks', sets: 2, rest: '20 sec' }, // Warm-up: 2 min
      { exerciseId: 'high-knees', sets: 4, rest: '20 sec' }, // Main: 25 min
      { exerciseId: 'push-ups', sets: 5, rest: '30 sec' },
      { exerciseId: 'squats', sets: 5, rest: '30 sec' },
      { exerciseId: 'mountain-climbers', sets: 5, rest: '20 sec' },
      { exerciseId: 'chair-dips', sets: 4, rest: '30 sec' },
      { exerciseId: 'bicycle-crunches', sets: 5, rest: '30 sec' },
      { exerciseId: 'lunges', sets: 4, rest: '30 sec' },
      { exerciseId: 'plank', sets: 4, rest: '30 sec' },
      { exerciseId: 'glute-bridge', sets: 3, rest: '30 sec' },
      { exerciseId: 'cat-cow', sets: 2, rest: '20 sec' }, // Cool-down: 2 min
      { exerciseId: 'child-pose', sets: 2, rest: '30 sec' }
    ]
  }
];
