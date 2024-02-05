import EdenLogo from '../../../components/EdenLogo';

interface WelcomeProps {
  heardleDay?: number | null | undefined;
  customHeardleCreator?: string | null;
}

export default function WelcomeCard({ heardleDay, customHeardleCreator }: WelcomeProps) {
  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center items-center gap-4">
          <EdenLogo height={50} width={50} />
          {heardleDay ? <h1 className="text-3xl lg:text-5xl font-bold text-center">Day {heardleDay}</h1> : <h1 className="text-3xl lg:text-5xl font-bold">Custom Heardle</h1>}
        </div>
        <p className="text-sm lg:text-lg text-center">Press play and choose a song to get started!</p>
        <p className="text-sm lg:text-lg text-center">Created by {customHeardleCreator}</p>
      </div>
    </div>
  );
}
