import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, StatusBar, SafeAreaView, Animated } from 'react-native';
import { SetBlock, ConfirmSelection } from './utils/components';
import { Exercise, getOrderedExercises, saveRecordedLift } from './utils/firebaseDataHandler';
import useTheme from './utils/theme/useTheme';

function App(): React.ReactElement {
  const [exerciseData, setExerciseData] = useState<
    { id: number; reps: number;}[]
  >([]);
  const [exName, setExName] = useState(""); // loaded exercise name
  const [exWeight, setExWeight] = useState(0); // loaded exercise weight
  const [exTag, setExTag] = useState(""); // loaded exercise tag


  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // index
 
  const [loading, setLoading] = useState(true); // loading
  const [error, setError] = useState<Error | null>(null); // error

  const [blockStates, setBlockStates] = useState<{ [id: number]: number }>({}); // setblocks

  const [overlayOpacity] = useState(new Animated.Value(0));

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
        setExTag(current.tag);
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
  

  const flashLoadingScreen = () => {
    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 0.9, 
        duration: 100, 
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0, 
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    saveRecordedLift(blockStates, exWeight, exTag);
    flashLoadingScreen();
    setTimeout(() => {
      loadNextExercise();
    }, 100);
  };

  return (
      <SafeAreaView style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: 'blue' }]} />

    
      <StatusBar backgroundColor="#000" barStyle="light-content" />
    
    

      <View>
        <Text style={[styles.bigFont]}>{exName}</Text>
        <Text style={[styles.bigFont, styles.white]}>{exWeight}kg</Text>

      </View>
      <View>{setBlockComponents}</View>
      <ConfirmSelection onPress={handleSubmit} />
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
    </SafeAreaView>
  );
}

const theme = useTheme();

const styles = StyleSheet.create({
  container: {
    marginTop: '0%',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  statusBar: {
    width: '100%', 
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
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers full screen
    backgroundColor: 'black', // Darkens screen
  },
});

export default App;
