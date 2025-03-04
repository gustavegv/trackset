import workoutData from "./data.json";
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, arrayUnion, doc, orderBy, query, getDoc, setDoc } from "firebase/firestore";

export interface Exercise {
  name: string;
  sets: Set[];
  weight: number;
  historic: Historic[];
  order?: number;
  tag: string;
}

interface Historic {
    avgSet: number;
    weightH: number;
}

interface Set {
    id: number;
    reps: number;
  }

export async function getOrderedExercises(): Promise<Exercise[]> {
  const q = query(collection(db, "push-day"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  const exercises: Exercise[] = [];
  snapshot.forEach(doc => {
    exercises.push(doc.data() as Exercise);
  });
  return exercises;
}


function transformBlocksToSets(blocks: { [id: number]: number }): Set[] {
  return Object.entries(blocks).map(([id, reps]) => ({
    id: Number(id),
    reps: reps,
  }));
}

export function saveRecordedLift(
                                blocks: { [id: number]: number }, 
                                weight: number,
                                exName: string
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

    pushHistoricData(exName, historicType);

    const newSets = transformBlocksToSets(blocks);
    pushNewSetToDB(exName, newSets);

    console.log('Compiled JSON data:', historicData);
}

const pushHistoricData = async (
  exerciseDocId: string,
  historicT: { [key: string]: number }
) => {
  try {
    const exerciseDocRef = doc(db, "push-day", exerciseDocId);
    
    await updateDoc(exerciseDocRef, {
      historic: arrayUnion(historicT)
    });
    
    console.log("Historic data pushed successfully");
  } catch (error) {
    console.error("Error pushing data: ", error);
  }
};


export async function pushNewSetToDB(
  exerciseDocId: string,
  newSets: Set[]
): Promise<void> {
  try {
    const exerciseDocRef = doc(db, "push-day", exerciseDocId);
    
    await updateDoc(exerciseDocRef, { sets: newSets });
    
    console.log("Sets updated successfully");
  } catch (error) {
    console.error("Error updating sets:", error);
  }
}




const fireStoreTest = {
  "name": "Overhead Press",
  "weight": 95,
  "sets": [
    {
      "id": 1,
      "reps": 10,
    },
    {
      "id": 2,
      "reps": 10,
    },
  ],
  "historic": []
}



const currentLayout = {
  "exercises": {
    "push": {
      "exercise": [
        {
          "name": "Overhead Press",
          "weight": 95,
          "sets": 4,
          "historic": []
        },
        {
          "name": "Bench Press",
          "weight": 135,
          "sets": 3,
          "historic": []
        }
      ]
    }
  }
}

const newOldLayout = {
  "push-day": {
    "bench": 
        {
          "name": "Bench Press",
          "weight": 95,
          "sets": [
              {
                "id": 1,
                "reps": 10,
              },
              {
                "id": 2,
                "reps": 10,
              },
              {
                "id": 3,
                "reps": 10,
              },
            ],
          "historic": []
        }
  }
}


const newLayout: Record<string, Record<string, any>> = {
  "push-day": {
    "bench": {
      "name": "Bench Press",
      "weight": 95,
      "sets": [
        { "id": 1, "reps": 10 },
        { "id": 2, "reps": 10 },
        { "id": 3, "reps": 10 }
      ],
      "historic": []
    }
  }
};

const shoulderPress: Exercise = {
  name: "Shoulder Press",
  weight: 50,
  sets: [
    { id: 1, reps: 12 },
    { id: 2, reps: 10 },
    { id: 3, reps: 8 }
  ],
  historic: [],
  order: 1,
  tag: "shoulder-press"
};

async function importNewLayout(): Promise<void> {
  for (const [collectionName, collectionData] of Object.entries(newLayout)) {
    for (const [docId, docData] of Object.entries(collectionData)) {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, docData);
      console.log(`Imported document "${docId}" into collection "${collectionName}"`);
    }
  }
}

async function addExerciseToSchedule(
  schedule: string,
  exerciseDocId: string,
  exercise: Exercise
): Promise<void> {
  try {
    const exerciseDocRef = doc(db, schedule, exerciseDocId);

    await setDoc(exerciseDocRef, exercise);
    console.log(`Exercise "${exerciseDocId}" added to schedule "${schedule}" successfully.`);
  } catch (error) {
    console.error("Error adding exercise:", error);
    throw error;
  }
}