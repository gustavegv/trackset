import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SetBlock, ConfirmSelection } from './utils/components';
import { getNextExercise } from './utils/firebaseDataHandler';

function App(): React.ReactElement {
  const [exerciseData, setExerciseData] = useState<
    { id: number; reps: number; weight?: number }[]
  >([]);
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
        const data = await getNextExercise(0); 
        setExerciseData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleSubmit = () => {
    const jsonData = JSON.stringify(blockStates);
    console.log('Compiled JSON data:', jsonData);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bigBlue}>Övning</Text>
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
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
  },
  red: {
    color: 'red',
  },
});

export default App;
