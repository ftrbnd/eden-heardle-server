import { HeardleType } from '@/utils/types';
import EdenLogo from '../../../components/EdenLogo';

interface WelcomeProps {
  heardleDay?: number | null | undefined;
  heardleType?: HeardleType;
  customHeardleCreator?: string | null;
}

export default function WelcomeCard({ heardleDay, heardleType, customHeardleCreator }: WelcomeProps) {
  return (
    <div className="card w-full bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center items-center gap-4">
          <EdenLogo height={50} width={50} />
          {heardleDay && <h1 className="text-3xl lg:text-5xl font-bold text-center">Day {heardleDay}</h1>}
          {heardleType === 'CUSTOM' && <h1 className="text-3xl lg:text-5xl font-bold">Custom Heardle</h1>}
          {heardleType === 'UNLIMITED' && <h1 className="text-3xl lg:text-5xl font-bold">Unlimited Heardle</h1>}
        </div>
        <p className="text-sm lg:text-lg text-center">Press play and choose a song to get started!</p>
        {heardleType === 'CUSTOM' && (
          <p className={`text-sm lg:text-lg text-center ${!customHeardleCreator && 'text-error'}`}>{customHeardleCreator ? `Created by ${customHeardleCreator}` : 'Failed to find Custom Heardle'}</p>
        )}
      </div>
    </div>
  );
}
