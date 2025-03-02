/**
 * TRACKSET Gym progress tracker
 */

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createSetBlocks } from './utils/renderContent';
import { ass } from './utils/test';
import { SetBlock, ConfirmSelection } from './utils/components'
import { useEffect, useState, useSyncExternalStore } from 'react';
import { getNextExercise }  from './utils/firebaseDataHandler'

const data = getNextExercise(0);

function App(): React.ReactElement {
  let exerciseIndex = 0;

  const [blockStates, setBlockStates] = useState<{ [id: number]: number }>({});

  const handleCountChange = (id: number, count: number) => {
    setBlockStates(prev => ({
      ...prev,
      [id]: count,
    }));
  };
  
  const setBlockComponents = data.map(block => (
    <SetBlock
      key={block.id}
      id={block.id}
      repNum={block.reps}
      onCountChange={handleCountChange}
    />
  ));

  const handleSubmit = () => {
    const jsonData = JSON.stringify(blockStates);

    console.log("Compiled JSON data:", jsonData);
  };
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bigBlue}>Övning</Text>
      </View>

      <View>{setBlockComponents}</View>

      <ConfirmSelection onPress={handleSubmit}/>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: '15%',
    alignItems: "center",
    display: "flex",
    height: "90%",
    flexDirection: "column",
    alignContent: "space-evenly",
    justifyContent: "space-between",
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },


});

export default App;
