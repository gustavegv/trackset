import workoutData from "./data.json";
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface Exercise {
  name: string;
  increased: boolean;
  avgRep: number;
  sets: Set[];

}

interface Set {
    id: number;
    reps: number;
  }

export async function getNextExercise(num: number): Promise<Exercise> {
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

export function saveRecordedLift(blocks: { [id: number]: number }): void {
    JSON.stringify(blocks);
}


const importDataToFirestore = async () => {
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





































/* 

const filePath = path.join(__dirname, "workoutData.json");

// Function to update an exercise name
const updateExerciseName = (oldName: string, newName: string): void => {
  try {
    // Read the JSON file
    const fileData = fs.readFileSync(filePath, "utf-8");
    const workoutData = JSON.parse(fileData);

    // Find the exercise
    const exercise = workoutData.exercises.find((ex: any) => ex.name === oldName);
    if (!exercise) {
      console.log(`Exercise "${oldName}" not found.`);
      return;
    }

    // Update the name
    exercise.name = newName;

    // Write the updated object back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(workoutData, null, 2), "utf-8");
    console.log(`Updated exercise name from "${oldName}" to "${newName}".`);
  } catch (error) {
    console.error("Error updating exercise name:", error);
  }
}; */