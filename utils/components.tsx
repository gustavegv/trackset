/**
 * Components for SetBlocks and ConfirmSelection
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useTheme from './theme/useTheme';

const theme = useTheme();

const Incrementers = ({ text, onPress }: {text: string; onPress: () => void}) => {
  return (
  <TouchableOpacity onPress={onPress}>
      <Text style={styles.setIncrement}>{text}</Text>
  </TouchableOpacity>
  );
}

export const SetBlock = ({
    id,
    repNum,
    onCountChange,
}: {
    id: number;
    repNum: number;
    onCountChange: (id: number, count: number) => void;
}) => {
    
    const [curCount, setCurCount] = useState(repNum);
    

    useEffect(() => {
        onCountChange(id, repNum);
        setCurCount(repNum);
        console.log("SB" + id + " created with " + repNum);
  }, [repNum]);

  const handleDecrement = () => {
    const newCount = curCount - 1;
    setCurCount(newCount);
    onCountChange(id, newCount); // Notify the parent
  };

  const handleIncrement = () => {
    const newCount = curCount + 1;
    setCurCount(newCount);
    onCountChange(id, newCount); 
  };


  return (
    <View style={styles.counterContainer}>
        <Text style={styles.setText}>Set {id}</Text>

        <View style={[styles.counterInnerContainer, styles.shadowBox]}>
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
  counterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  counterInnerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    margin: 6,
    padding: 10,
    paddingHorizontal: 60,
    borderRadius: theme.borderRad,
  },
  setIncrement: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    textAlign: "center",
    paddingVertical: 16,
    width: 50,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: theme.colors.secondary,
  },
  counter: {
    backgroundColor: theme.colors.primary,
    width: 100,
    paddingVertical: 22,
    textAlign: "center",
    color: theme.colors.text,
    fontSize: 46,
  },
  confirm: {
    width: "50%",
    backgroundColor: theme.colors.secondary,
    color: theme.colors.text,
    textAlign: "center",
    paddingVertical: 20,
    borderRadius: theme.borderRad
  },
  confirmBox: {
    width: '100%',
    alignItems: 'center',
    margin: 30,
    
  },
  setText: {
    color: theme.colors.text
  },
  shadowBox: {
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,  // Controls vertical shadow
    },
    shadowOpacity: 0.2, // Adjust for transparency
    shadowRadius: 6, // Soften edges

  },

});