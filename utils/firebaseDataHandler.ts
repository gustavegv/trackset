import workoutData from "./data.json";
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, arrayUnion, doc, orderBy, query, getDoc } from "firebase/firestore";

interface Exercise {
  name: string;
  sets: Set[];
  weight: number;
  historic: Historic[];
}

interface Historic {
    avgSet: number;
    weightH: number;
}

interface Set {
    id: number;
    reps: number;
  }

  export async function getNextExercise(num: number): Promise<Exercise> {
    try {
      const docRef = doc(db, "exercises", "push");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allMovements = data.exercise as Exercise[];
  
        if (allMovements && allMovements[num]) {
          return allMovements[num];
        } else {
          throw new Error(`Exercise not found for index ${num}`);
        }
      } else {
        throw new Error("Document 'push' not found in the 'exercises' collection");
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      throw error;
    }
  }

export async function ggetNextExercise(num: number): Promise<Exercise> {
  try {
    const querySnapshot = await getDocs(collection(db, "exercises"));
    
    const exercises = querySnapshot.docs.map(doc => doc.data() as Exercise);

    if (exercises[num]) {
      return exercises[num];
    } else {
      throw new Error(`Exercise not found for index ${num}`);
    }
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }
}

export function saveRecordedLift(
                                blocks: { [id: number]: number }, 
                                weight: number,
                                exerciseIndex: number
                              ): void {
    let addedReps = 0;
    let noOfReps = 0;

    for (const [id, value] of Object.entries(blocks)) {
      noOfReps++;
      addedReps += value;
    }
    const avgReps = addedReps / noOfReps;

    const historicType: { [key: string]: number } = {
      avgSet: avgReps,
      weightH: weight,
    };

    const historicData = JSON.stringify(historicType);
    
    ppush(historicType, 0);
    // convert to historic type
    // push newH to historic
    // push / overwrite new data to sets

    console.log('Compiled JSON data:', historicData);
    
}


const ppush = async (
  historicT: { [key: string]: number },
  exerciseIndex: number
) => {
  try {
    const exerciseDocRef = doc(db, "exercises", "push");

    const docSnap = await getDoc(exerciseDocRef);
    if (!docSnap.exists()) {
      throw new Error("Document 'push' not found in the 'exercises' collection");
    }
    
    const data = docSnap.data();
    const exercises = data.exercise as any[];
    
    if (!exercises || exerciseIndex < 0 || exerciseIndex >= exercises.length) {
      throw new Error(`Exercise not found at index ${exerciseIndex}`);
    }
    
    const updatedExercises = [...exercises];
    
    if (!updatedExercises[exerciseIndex].historic) {
      updatedExercises[exerciseIndex].historic = [];
    }
    
    updatedExercises[exerciseIndex].historic.push(historicT);
    
    await updateDoc(exerciseDocRef, { exercise: updatedExercises });
    
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error pushing data: ", error);
  }
};



const pppush = async (
          historicT:{ [key: string]: number },
          exerciseIndex: number
) => {
  try {
    const exerciseDocRef = doc(db, "exercises", "push");
    await updateDoc(exerciseDocRef, {
      historic: arrayUnion(historicT) 
    });
    console.log("Document updated successfully");
  } catch (error){
    console.error("Error pushing data: ", error);
  }
}

const oldImportDataToFirestore = async () => {
  try {
    for (const exercise of workoutData.push) {
      await addDoc(collection(db, "exercises"), exercise);
      console.log(`Added: ${exercise.name}`);
    }
    console.log("All data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

const fireStoreTest = {
  "name": "Overhead Press",
  "weight": 95,
  "sets": 4,
  "historic": []
}



export async function importToFirestore(schedule: string, newExercise: Exercise): Promise<void> {
  try {
    const exerciseDocRef = doc(db, "exercises", schedule);

    const docSnap = await getDoc(exerciseDocRef);
    if (!docSnap.exists()) {
      throw new Error("Document '" + schedule + "' not found in the 'exercises' collection");
    }

    const data = docSnap.data();
    const exercises = (data.exercise as Exercise[]) || [];

    const updatedExercises = [...exercises, newExercise];

    await updateDoc(exerciseDocRef, { exercise: updatedExercises });
    console.log("Exercise added successfully");
  } catch (error) {
    console.error("Error adding exercise:", error);
    throw error;
  }
}
