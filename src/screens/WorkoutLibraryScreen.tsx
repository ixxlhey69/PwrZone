import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Exercise } from '../types';

const exercises: Record<string, Exercise[]> = {
  Chest: [
    { id: '1', name: 'Bench Press', muscleGroup: 'Chest', description: '1. Lie flat on a bench with your feet on the floor.\n2. Grip the bar slightly wider than shoulder-width.\n3. Lower the bar slowly to your mid-chest.\n4. Press the bar back up until your arms are fully extended.\n5. Keep your back flat and avoid bouncing the bar.', imageUrl: '' },
    { id: '2', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', description: '1. Set an incline bench to a 30–45 degree angle.\n2. Sit back with a dumbbell in each hand at chest level.\n3. Press the dumbbells upward until your arms are extended.\n4. Lower the weights slowly to the starting position.\n5. Keep your core tight and control the motion.', imageUrl: '' },
  ],
  Back: [
    { id: '3', name: 'Pull-ups', muscleGroup: 'Back', description: '1. Grab a pull-up bar with an overhand grip, hands shoulder-width apart.\n2. Hang with arms fully extended.\n3. Pull your chest up toward the bar, squeezing your back.\n4. Lower yourself back down with control.\n5. Repeat for desired reps.', imageUrl: '' },
    { id: '4', name: 'Barbell Rows', muscleGroup: 'Back', description: '1. Stand with feet hip-width apart, barbell in front.\n2. Bend at hips and knees, grip the bar just outside your knees.\n3. Pull the barbell to your lower chest, keeping elbows close.\n4. Lower the bar with control.\n5. Keep your back flat throughout.', imageUrl: '' },
  ],
  Legs: [
    { id: '5', name: 'Squats', muscleGroup: 'Legs', description: '1. Stand with feet shoulder-width apart, barbell on your upper back.\n2. Brace your core and keep chest up.\n3. Lower down by bending knees and hips.\n4. Go until thighs are parallel to the floor.\n5. Push through your heels to stand back up.', imageUrl: '' },
    { id: '6', name: 'Deadlifts', muscleGroup: 'Legs', description: '1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Bend at hips and knees, grip the bar just outside your knees.\n3. Keep your chest up and back flat.\n4. Stand up by driving through your heels, lifting the bar.\n5. Lower the bar to the floor with control.', imageUrl: '' },
  ],
  Shoulders: [
    { id: '7', name: 'Overhead Press', muscleGroup: 'Shoulders', description: '1. Stand with feet shoulder-width apart, barbell at shoulder height.\n2. Grip the bar just outside your shoulders.\n3. Press the bar overhead until arms are fully extended.\n4. Lower the bar back to your shoulders with control.\n5. Keep your core tight and avoid arching your back.', imageUrl: '' },
    { id: '8', name: 'Lateral Raises', muscleGroup: 'Shoulders', description: '1. Stand with a dumbbell in each hand at your sides.\n2. Keep a slight bend in your elbows.\n3. Raise arms out to the sides until parallel to the floor.\n4. Lower the weights slowly.\n5. Do not shrug your shoulders up.', imageUrl: '' },
  ],
  Arms: [
    { id: '9', name: 'Bicep Curls', muscleGroup: 'Arms', description: '1. Stand with dumbbells at your sides, palms facing forward.\n2. Curl the weights up to shoulder level.\n3. Squeeze your biceps at the top.\n4. Lower the weights slowly.\n5. Keep your elbows close to your torso.', imageUrl: '' },
    { id: '10', name: 'Tricep Extensions', muscleGroup: 'Arms', description: '1. Hold a dumbbell with both hands overhead.\n2. Keep elbows close to your ears.\n3. Lower the weight behind your head.\n4. Extend arms back to the top.\n5. Keep upper arms stationary.', imageUrl: '' },
  ],
  Core: [
    { id: '11', name: 'Planks', muscleGroup: 'Core', description: '1. Lie face down, forearms on the floor.\n2. Push up onto your toes and forearms.\n3. Keep your body in a straight line.\n4. Hold this position, keeping core tight.\n5. Do not let hips sag or rise.', imageUrl: '' },
    { id: '12', name: 'Crunches', muscleGroup: 'Core', description: '1. Lie on your back, knees bent, feet flat.\n2. Place hands behind your head.\n3. Curl your upper body toward your knees.\n4. Lower back down with control.\n5. Avoid pulling on your neck.', imageUrl: '' },
  ],
  Bulking: [
    { id: 'b1', name: 'Barbell Squat', muscleGroup: 'Legs', description: '1. Set a barbell on a squat rack at shoulder height.\n2. Step under the bar and rest it on your upper back.\n3. Unrack the bar and step back.\n4. Squat down by bending hips and knees.\n5. Push through your heels to return to standing.', imageUrl: '' },
    { id: 'b2', name: 'Deadlift', muscleGroup: 'Back/Legs', description: '1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Grip the bar just outside your knees.\n3. Keep chest up and back flat.\n4. Stand up, lifting the bar by extending hips and knees.\n5. Lower the bar to the floor with control.', imageUrl: '' },
    { id: 'b3', name: 'Bench Press', muscleGroup: 'Chest', description: '1. Lie flat on a bench with your feet on the floor.\n2. Grip the bar slightly wider than shoulder-width.\n3. Lower the bar slowly to your mid-chest.\n4. Press the bar back up until your arms are fully extended.\n5. Keep your back flat and avoid bouncing the bar.', imageUrl: '' },
    { id: 'b4', name: 'Weighted Pull-ups', muscleGroup: 'Back', description: '1. Attach weight to a belt or hold a dumbbell between your feet.\n2. Grab the pull-up bar with an overhand grip.\n3. Pull your chest to the bar, squeezing your back.\n4. Lower yourself with control.\n5. Repeat for desired reps.', imageUrl: '' },
    { id: 'b5', name: 'Overhead Press', muscleGroup: 'Shoulders', description: '1. Stand with feet shoulder-width apart, barbell at shoulder height.\n2. Grip the bar just outside your shoulders.\n3. Press the bar overhead until arms are fully extended.\n4. Lower the bar back to your shoulders with control.\n5. Keep your core tight and avoid arching your back.', imageUrl: '' },
    { id: 'b6', name: 'Barbell Row', muscleGroup: 'Back', description: '1. Stand with feet hip-width apart, barbell in front.\n2. Bend at hips and knees, grip the bar just outside your knees.\n3. Pull the barbell to your lower chest, keeping elbows close.\n4. Lower the bar with control.\n5. Keep your back flat throughout.', imageUrl: '' },
    { id: 'b7', name: 'Dumbbell Flyes', muscleGroup: 'Chest', description: '1. Lie on a bench with dumbbells in hand, arms extended above chest.\n2. Lower the dumbbells out to the sides in a wide arc.\n3. Keep a slight bend in your elbows.\n4. Raise the weights back up over your chest.\n5. Squeeze your chest at the top.', imageUrl: '' },
    { id: 'b8', name: 'Leg Press', muscleGroup: 'Legs', description: '1. Sit on the leg press machine with feet on platform.\n2. Unrack the weight and lower it by bending knees.\n3. Go until knees are at 90 degrees.\n4. Press the platform back up to starting position.\n5. Do not lock out your knees.', imageUrl: '' },
    { id: 'b9', name: 'EZ Bar Curl', muscleGroup: 'Arms', description: '1. Stand holding an EZ bar with an underhand grip.\n2. Curl the bar up to shoulder height.\n3. Squeeze your biceps at the top.\n4. Lower the bar with control.\n5. Keep elbows close to your torso.', imageUrl: '' },
    { id: 'b10', name: 'Skullcrushers', muscleGroup: 'Arms', description: '1. Lie on a bench with an EZ bar.\n2. Extend arms straight above chest.\n3. Bend elbows to lower bar toward forehead.\n4. Extend arms back to start.\n5. Keep elbows stationary throughout.', imageUrl: '' },
  ],
  Cutting: [
    { id: 'c1', name: 'HIIT Sprints', muscleGroup: 'Full Body', description: '1. Warm up with light jogging.\n2. Sprint at max effort for 20–30 seconds.\n3. Walk or rest for 60–90 seconds.\n4. Repeat for 5–10 rounds.\n5. Cool down with light jogging.', imageUrl: '' },
    { id: 'c2', name: 'Battle Ropes', muscleGroup: 'Arms/Core', description: '1. Stand with feet shoulder-width apart, knees slightly bent.\n2. Grip the ends of the ropes.\n3. Alternate or slam both arms to create waves.\n4. Keep core tight and back straight.\n5. Perform for intervals (e.g., 30 seconds on, 30 off).', imageUrl: '' },
    { id: 'c3', name: 'Burpees', muscleGroup: 'Full Body', description: '1. Stand upright, then squat down and place hands on floor.\n2. Jump feet back to a push-up position.\n3. Perform a push-up.\n4. Jump feet forward to squat.\n5. Explode up with a jump at the top.', imageUrl: '' },
    { id: 'c4', name: 'Mountain Climbers', muscleGroup: 'Core/Legs', description: '1. Start in a push-up position.\n2. Drive one knee toward your chest.\n3. Switch legs quickly, alternating knees.\n4. Keep hips low and core tight.\n5. Move as fast as possible.', imageUrl: '' },
    { id: 'c5', name: 'Jump Rope', muscleGroup: 'Full Body', description: '1. Hold rope handles at your sides.\n2. Swing rope overhead and jump as it passes under your feet.\n3. Land softly on the balls of your feet.\n4. Keep elbows close to your sides.\n5. Maintain a steady rhythm.', imageUrl: '' },
    { id: 'c6', name: 'Plank Variations', muscleGroup: 'Core', description: '1. Get into plank position on forearms or hands.\n2. Hold your body straight from head to heels.\n3. Try side planks or plank with leg lifts for variation.\n4. Keep core engaged throughout.\n5. Hold as long as possible with good form.', imageUrl: '' },
    { id: 'c7', name: 'Walking Lunges', muscleGroup: 'Legs', description: '1. Stand upright, feet together.\n2. Step forward with one leg and lower hips until both knees are bent at 90 degrees.\n3. Push off the back foot and step forward into the next lunge.\n4. Alternate legs as you move forward.\n5. Keep chest up and core tight.', imageUrl: '' },
    { id: 'c8', name: 'Push-ups', muscleGroup: 'Chest/Arms', description: '1. Start in a plank position, hands under shoulders.\n2. Lower chest to the floor by bending elbows.\n3. Push back up to starting position.\n4. Keep body straight and core tight.\n5. Repeat for desired reps.', imageUrl: '' },
    { id: 'c9', name: 'Russian Twists', muscleGroup: 'Core', description: '1. Sit on the floor with knees bent, feet lifted.\n2. Lean back slightly, hold a weight or medicine ball.\n3. Rotate your torso to one side, then the other.\n4. Tap the weight to the floor beside your hip each time.\n5. Keep core engaged and back straight.', imageUrl: '' },
    { id: 'c10', name: 'Medicine Ball Slams', muscleGroup: 'Full Body', description: '1. Stand with feet shoulder-width apart, holding a medicine ball overhead.\n2. Slam the ball down to the floor as hard as possible.\n3. Squat to pick it up.\n4. Return to standing and repeat.\n5. Keep your core tight throughout.', imageUrl: '' },
  ],
};

export const WorkoutLibraryScreen = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Library</Text>
      {Object.keys(exercises).map((group) => (
        <View key={group}>
          <TouchableOpacity 
            style={styles.muscleGroupCard}
            onPress={() => setSelectedGroup(selectedGroup === group ? null : group)}
          >
            <Text style={styles.muscleGroupTitle}>{group}</Text>
          </TouchableOpacity>
          
          {selectedGroup === group && exercises[group].map((exercise) => (
            <TouchableOpacity 
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => setSelectedExercise(exercise)}
            >
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <Modal
        visible={selectedExercise !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExercise && (
              <>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                <Text style={styles.modalDescription}>{selectedExercise.description}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setSelectedExercise(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  muscleGroupCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  muscleGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  exerciseCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 6,
    marginLeft: 16,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    color: '#444',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});