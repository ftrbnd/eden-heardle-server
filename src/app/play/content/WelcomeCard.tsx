import { User } from '@prisma/client';
import EdenLogo from '../../../components/EdenLogo';

interface WelcomeProps {
  heardleDay?: number | null | undefined;
  onCustomHeardlePage?: boolean;
  customHeardleCreator?: User | null;
}

export default function WelcomeCard({ heardleDay, onCustomHeardlePage, customHeardleCreator }: WelcomeProps) {
  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center items-center gap-4">
          <EdenLogo height={50} width={50} />
          <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold text-center"> {heardleDay ? ` Day ${heardleDay}` : 'Custom Heardle'}</h1>
        </div>
        <p className="text-sm lg:text-lg text-center">Press play and choose a song to get started!</p>
        {customHeardleCreator && <p className="text-sm lg:text-lg text-center">Created by {customHeardleCreator.name}</p>}
        {onCustomHeardlePage && !customHeardleCreator && <p className="text-sm lg:text-lg text-center text-error">Failed to find song data</p>}
      </div>
    </div>
  );
}
