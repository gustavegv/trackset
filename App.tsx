import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SetBlock, ConfirmSelection } from './utils/components';
import { Exercise, getOrderedExercises, saveRecordedLift } from './utils/firebaseDataHandler';
import useTheme from './utils/theme/useTheme';

function App(): React.ReactElement {
  const [exerciseData, setExerciseData] = useState<
    { id: number; reps: number;}[]
  >([]);
  const [exName, setExName] = useState(""); // loaded exercise name
  const [exWeight, setExWeight] = useState(0); // loaded exercise weight

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // index
 
  const [loading, setLoading] = useState(true); // loading
  const [error, setError] = useState<Error | null>(null); // error

  const [blockStates, setBlockStates] = useState<{ [id: number]: number }>({}); // setblocks

  const handleCountChange = (id: number, count: number) => {
    setBlockStates((prev) => ({
      ...prev,
      [id]: count,
    }));
  };

const [exercises, setExercises] = useState<Exercise[]>([]);

useEffect(() => {
  const fetchExercises = async () => {
    try {
      const allExercises = await getOrderedExercises();
      setExercises(allExercises);
      if (allExercises.length > 0) {
        const current = allExercises[currentExerciseIndex];
        setExerciseData(current.sets);
        setExName(current.name);
        setExWeight(current.weight);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  fetchExercises();
}, []);

useEffect(() => {
  if (exercises.length < 1 || exercises.length <= currentExerciseIndex) {
    setExerciseData([]);
    setExName("");
    setExWeight(0);
    console.log("No more exercises in schedule");
  } else {
    const current = exercises[currentExerciseIndex];
    if (current) {
      setExerciseData(current.sets);
      setExName(current.name);
      setExWeight(current.weight);
    }
  }

}, [currentExerciseIndex, exercises]);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading exercises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const setBlockComponents = exerciseData.map((block) => (
    <SetBlock
      key={block.id}
      id={block.id}
      repNum={block.reps}
      onCountChange={handleCountChange}
    />
  ));

  const loadNextExercise = () => {
    setCurrentExerciseIndex(prevIndex => prevIndex + 1);
    console.log("Loading next exercise...")
  };
  

  const handleSubmit = () => {
    saveRecordedLift(blockStates, exWeight, currentExerciseIndex);
    loadNextExercise();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.bigFont]}>{exName}</Text>
        <Text style={[styles.bigFont, styles.white]}>{exWeight}kg</Text>

      </View>
      <View>{setBlockComponents}</View>
      <ConfirmSelection onPress={handleSubmit} />
    </View>
  );
}

const theme = useTheme();

const styles = StyleSheet.create({
  container: {
    marginTop: '15%',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  bigFont: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.secondary,

  },
  white: {
    color: theme.colors.text,
    fontSize: 20,
  },
});

export default App;
