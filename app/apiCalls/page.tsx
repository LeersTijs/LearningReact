'use client'

import React, { useState } from 'react';

interface CatFact {
    fact: string,
    length: number
}

export default function APICall() {

    const [data, setData] = useState<CatFact>();

    const getCatFact = async () => {
        const respone = await fetch('https://catfact.ninja/fact');
        const json: CatFact = await respone.json();
        setData(json)
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-4">
            <div className="bg-gray-800 text-white shadow-md rounded-lg p-6 flex flex-col items-center max-w-md">
                <button 
                    onClick={getCatFact} 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
                >
                    Get Cat Fact
                </button>
                <div className="max-w-xs text-center break-words bg-gray-900 p-4 rounded-lg h-32 overflow-auto">
                    {data ? data.fact : "No fun fact yet..."}
                </div>
            </div>
        </div>
    );
}