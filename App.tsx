/**
 * TRACKSET Gym progress tracker
 */

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createSetBlocks } from './utils/renderContent';
import { SetBlock, ConfirmSelection } from './utils/components'
import { useEffect, useState, useSyncExternalStore } from 'react';
import { jsx } from 'react/jsx-runtime';

const data = [
  { id: 1, setNum: 1, weight: 1, repNum: 10 },
  { id: 2, setNum: 2, weight: 0, repNum: 9 },
  { id: 3, setNum: 3, weight: 0, repNum: 200 },
  { id: 4, setNum: 4, weight: 0, repNum: 200 },

];

function App(): React.ReactElement {
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
      setNum={block.setNum}
      weight={block.weight}
      repNum={block.repNum}
      onCountChange={handleCountChange}
    />
  ));

  const handleSubmit = () => {
    const jsonData = JSON.stringify(blockStates);
    console.log("shuuuuurda");
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
