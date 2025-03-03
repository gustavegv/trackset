import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SetBlock, ConfirmSelection } from './utils/components';
import { getNextExercise, saveRecordedLift } from './utils/firebaseDataHandler';

function App(): React.ReactElement {
  const [exerciseData, setExerciseData] = useState<
    { id: number; reps: number;}[]
  >([]);
  const [exName, setExName] = useState("");
  const [exWeight, setExWeight] = useState(0);


  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [blockStates, setBlockStates] = useState<{ [id: number]: number }>({});

  const handleCountChange = (id: number, count: number) => {
    setBlockStates((prev) => ({
      ...prev,
      [id]: count,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNextExercise(currentExerciseIndex); 
        setExerciseData(data.sets);
        setExName(data.name);
        setExWeight(data.weight);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentExerciseIndex]);

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
        <Text style={[styles.bigFont, styles.red]}>{exName}</Text>
        <Text style={styles.bigFont}>{exWeight}kg</Text>

      </View>
      <View>{setBlockComponents}</View>
      <ConfirmSelection onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: '15%',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  bigFont: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
  },
  red: {
    color: 'red',
  },
});

export default App;
