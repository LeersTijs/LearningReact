'use client'

import Link from "next/link";
import { useState } from "react";
// import { createRoot } from "react-dom/client";

function Square({value, onSquareClick}: {value: string, onSquareClick: () => void}) {
    // const [value, setValue] = useState("");

    return (
        <button 
            className="w-20 h-20 text-3xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board ( {player, squares, winner, onPlay } : {player: string, squares: string[], winner: string, onPlay: (nextSquares: string[], index: number) => void } ) {

    const handleClick = (index: number) => {
        if (squares[index] || winner)
            return;

        let nextSquares = squares.slice(); //copy squares
        nextSquares[index] = player

        onPlay(nextSquares, index)
    }
    return (
        <div className="bg-gray-800 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Tic Tac Toe</h1>
            <h2 className="text-1xl text-gray-200 mb-4">
                {winner ? `The winner: ${winner}` : `Current player: ${player}`}
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
                {squares.map((value, index) => (
                    <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
                ))}
            </div>
            <button
                onClick={() => onPlay([], -1)}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
            >
                Reset Board
            </button>
        </div>
    );
}

function History( {history, jumpTo} : {history: string[][], jumpTo: (index: number) => void}) {
    return (
        <div className="bg-gray-800 text-white shadow-md rounded-lg p-4 w-52">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <ol className="list-inside space-y-2">
                {history.slice(1).map((_squares, index) => 
                    <li key={index}>
                        <button 
                            onClick={() => jumpTo(index + 1)} 
                            className="w-full text-left px-2 py-1 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Go to move {index + 1}
                        </button>
                    </li>
                )}
            </ol>
        </div>
    );
}

export default function App() {
    // const [squares, setSquares] = useState<string[]>(Array(9).fill(""));
    const [history, setHistory] = useState<string[][]>([Array(9).fill("")])
    const [player, setPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string>("");
    const currentSquares = history[history.length - 1];

    function handlePlay(nextSquares: string[], index: number) {

        if (index === -1) {
            setWinner("")
            setPlayer("X")
            setHistory([Array(9).fill("")])
            return
        }

        setHistory([...history, nextSquares])
        setWinner(calculateWinner(nextSquares, index))
        setPlayer(player === "X"? "O": "X");
    }

    function jumpTo(index: number) {
        const newHistory = [...history.slice(0, index + 1)]
        console.log(newHistory);
        setHistory(newHistory);
        setWinner("");
        setPlayer(newHistory.length % 2 === 0 ? "O" : "X")
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-4">
            <div className="absolute top-4 right-4">
                <Link href="./" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                    Go Back
                </Link>
            </div>
            
            <div className="flex items-start gap-12">
                <Board player={player} squares={currentSquares} winner={winner} onPlay={handlePlay}/>
                <History history={history} jumpTo={jumpTo} />
            </div>
        </div>
    );
}

function calculateWinner(squares: string[], lastPlayedMove: number): string {
    // This function will see if the lastPlayedMove was a winning move

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    const posibleLines = lines.filter((element, _index, _array) => element.includes(lastPlayedMove))
    
    for (let idx in posibleLines) {
        const [a, b, c] = posibleLines[idx]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
            return squares[lastPlayedMove] // Return who did the last move
    }

    if (!squares.includes(""))
        return "draw"

    return ""
}