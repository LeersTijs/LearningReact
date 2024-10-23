import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { auth, db } from "./firebase";
import { addDoc, collection, setDoc, doc, getDoc } from "firebase/firestore";

import React, { useState } from "react";

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors">
            Sign Out
        </button>
    )
}

interface Task {
    task: String,
    priority: number,
    done: boolean // This is not needed, idk why i decides to add this. We could have probs have just read the status of the checkbox to see if the task was done
}

function LoginContainer() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const addUserToDB = async (userId: string) => {
        try {
            await setDoc(doc(db, "users", userId), {
                email: email
            })

            const tasksCollection = collection(db, `users/${userId}/tasks`);
            await addDoc(tasksCollection, {
                task: "Starting a todo list", // Default task
                priority: 1, // Default priority
                done: false, // Task not completed
                createdAt: new Date(), // Timestamp
            });

            console.log("User added to DB with initial task");

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        console.log("loged in using google");

        // TODO: check if user exists in Firestore 
        const userId = cred.user.uid;
        addUserToDB(userId); 
        // Without checking if the user exists will result in multiple default tasks everytime the user logs in
    };

    const signInWithEmail = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
             const cred = await signInWithEmailAndPassword(auth, email, password);
             console.log("loged in using email");
             console.log(cred);
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                        // The credentials were invalid so we create a new account for this email and pw
                        const cred = await createUserWithEmailAndPassword(auth, email, password);
                        addUserToDB(cred.user.uid);
                        break;
                    default:
                        console.error("An error occurred:", error.message);
                }
            } else {
                console.error("An unknown error occurred:", error);
            }
        }        
    }

    return (
        <div className="bg-gray-800 text-white shadow-md rounded-lg p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">
                Login to My Todo List
            </h1>
            <form onSubmit={signInWithEmail} className="flex flex-col gap-4 w-full max-w-xs">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-lg font-medium">
                        Email:
                    </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="pw" className="text-lg font-medium">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="pw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="Enter your password"
                    />
                </div>
                
                {/* Buttons Container */}
                <div className="flex justify-between gap-4">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Log In
                    </button>

                    <button
                        type="button"
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        onClick={signInWithGoogle}
                    >
                        Sign in with Google
                    </button>
                </div>
            </form>
        </div>
    );
}

export { LoginContainer, SignOut }; 
export type { Task };