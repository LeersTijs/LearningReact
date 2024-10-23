export interface Team {
  name: string;
  players: string[]
}

function MyList( {elements} : { elements: string[] } ) {
  return (
        <ul className="mt-4 list-disc list-inside">
            {elements.map((element, index) => (
                <li key={index} className="mt-1 text-lg">
                    {element}
                </li>
            ))}
        </ul>
        );
}

export default function TeamPage( { team }: { team: Team } ) {
    return (
      <div className="mt-6 p-4 bg-gray-800 text-white rounded-lg shadow-md flex justify-center">
        <div className="max-w-lg text-center">
            <h2 className="text-2xl font-bold">Meet the Team</h2>
            <h1>Our team name is: {team.name} </h1>
            {/* <ul className="mt-4 list-disc list-inside">
                {team.players.map((player, index) => (
                  <li key={index} className="mt-1 text-lg">
                    {player}
                  </li>
                ))}
            </ul> */}
            <MyList elements={team.players} />
        </div>
      </div>
    );
  }