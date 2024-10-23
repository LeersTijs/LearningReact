'use client'

import { LoginContainer, SignOut, Task } from "./loginAndOut";
import { auth, db } from "./firebase";
import { useAuthState } from 'react-firebase-hooks/auth';

import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";

interface TodoContainerProps {
    user: User; 
}

function Tasks( {tasks, toggleTaskDone} : {tasks: Task[], toggleTaskDone: (index: number) => void}) {
    return (
        <ul className="list-disc list-inside mb-4">
            {
            tasks
                .sort((a, b) => b.priority - a.priority)
                .map((task: Task, index: number) =>(
                    <li key={index} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <input 
                                
                                type="checkbox" 
                                className="mr-2 accent-blue-500" 
                                checked={task.done} 
                                onChange={() => toggleTaskDone(index)}/>
                            <span >{task.task}</span>
                        </div>
                        <span className="text-gray-400">Priority: {task.priority}/10</span>
                    </li>
            ))
            }
        </ul>
    );
}

function TodoContainer( {user} : TodoContainerProps) {
    const [todoList, setTodoList] = useState<Task[]>([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userUid = user.uid;
                console.log(userUid);
                const tasksCollection = collection(db, `users/${userUid}/tasks`);
                const taskSnapshot = await getDocs(tasksCollection);
                const tasksList = taskSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as unknown as Task[]; // Map Firestore documents to Task objects
                setTodoList(tasksList);
            } catch (error) {
                console.error("HIER: ", error);
            }
            
        }

        if (todoList.length === 0) {
            fetchTasks();
        }        
    }); // When the TodoContainer changes then the lambda function is called.
    // it is also called when the container changes so also when a input is typed in one of the 
    // input boxes 
    // (so this could probs be used to see when the + is pressed then a modified version of addNewTask could be used)


    const toggleTaskDone = (index: number) => {
        setTodoList((prevTodoList) =>
            prevTodoList.map((task, i) =>
                i === index ? { ...task, done: !task.done } : task
            )
        );
    };

    const addNewTask = async (event: React.FormEvent) => {

        event.preventDefault();

        if (task === "" || priority === "") {
            return;
        }

        const newTask: Task = {
            task: task.trim(),
            priority: Number(priority),
            done: false
        }
        try {
            const tasksCollection = collection(db, `users/${user.uid}/tasks`);
            await addDoc(tasksCollection, {
                task: newTask.task,
                priority: newTask.priority,
                done: newTask.done,
                createdAt: new Date()
            });
        } catch (e) {
            console.error("failed writing task: ", e);
        }
        

        setTodoList(prevTodoList => [...prevTodoList, newTask]);
        setTask("");
        setPriority("");
    };

    return (
        <div className="bg-gray-800 text-white shadow-md rounded-lg p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-4">you are loged in as: {user.displayName}</h1>

            <h2 className="text-xl font-semibold mb-2">Your Todos:</h2>
            <Tasks tasks={todoList} toggleTaskDone={toggleTaskDone}/>
            

            <div className="flex flex-col gap-4">
                <form onSubmit={addNewTask} className="flex items-center gap-2">
                    {/* Input for Task */}
                    <input
                        type="text"
                        placeholder="Add a new todo"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />

                    {/* Input for Priority */}
                    <input
                        type="number"
                        placeholder="Priority"
                        min="1"
                        max="10"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-14 px-2 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-center"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors h-full"
                    >
                        +
                    </button>
                </form>
            </div>
        </div>
    )
}



export default function TodoList() {
    let [user] = useAuthState(auth);

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-4">
            <div className="absolute top-4 right-4">
                <SignOut />
            </div>
            {user ? <TodoContainer user={user} /> : <LoginContainer />}
        </div>
    );
}