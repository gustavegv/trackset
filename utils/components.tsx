/**
 * Components for SetBlocks and ConfirmSelection
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const Incrementers = ({ text, onPress }: {text: string; onPress: () => void}) => {
  return (
  <TouchableOpacity onPress={onPress}>
      <Text style={styles.setIncrement}>{text}</Text>
  </TouchableOpacity>
  );
}

export const SetBlock = ({
    id,
    setNum, 
    weight, 
    repNum,
    onCountChange,
}: {
    id: number;
    setNum: number; 
    weight: number; 
    repNum: number;
    onCountChange: (id: number, count: number) => void;
}) => {
  const [curCount, setCurCount] = useState(repNum);

  const handleDecrement = () => {
    setCurCount((prev) => prev - 1);
    onCountChange(id, curCount); 
  };

  const handleIncrement = () => {
    setCurCount((prev) => prev + 1);
    onCountChange(id, curCount); 
  };


  return (
    <View style={styles.counterContainer}>
        <Text style={styles.red}>Set {setNum}</Text>
        <View style={styles.counterInnerContainer}>
          <Incrementers text={"-"} onPress={handleDecrement}></Incrementers>
          <Text style={styles.counter}>{curCount}</Text>
          <Incrementers text={"+"} onPress={handleIncrement}></Incrementers>
        </View>
      </View>
  );
}

export const ConfirmSelection = ({onPress} : {onPress: () => void}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.confirmBox}>
            <Text style={styles.confirm}>Confirm</Text>
        </TouchableOpacity>
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

  red: {
    color: 'red',
  },
  counterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  counterInnerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  setIncrement: {
    backgroundColor: 'blue',
    color: "white",
    textAlign: "center",
    paddingVertical: 16,
    width: 50,
    marginHorizontal: 10,
  },
  counter: {
    backgroundColor: "red",
    width: 100,
    paddingVertical: 22,
    textAlign: "center",
    color: "white",
    fontSize: 46,
  },
  confirm: {
    width: "50%",
    backgroundColor: "green",
    color: "white",
    textAlign: "center",
    paddingVertical: 20,
  },
  confirmBox: {
    width: '100%',
    alignItems: 'center'
  }

});