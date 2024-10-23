import AboutInfo from './AboutInfo'; // Importing an extra component for the About page
import TeamPage, { Team } from './team';


const team: Team = {
    name: "The A team",
    players: ["Hannibal", "B.A", "Faceman", "Howlin Mad"]
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="mt-4 text-lg">
        Welcome to the About page. Here you can learn more about our organization.
      </p>
      
      {/* Using the imported AboutInfo component */}
      <AboutInfo />
      <TeamPage team={team} />
    </div>
  );
}