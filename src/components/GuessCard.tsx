import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

interface IProps {
  name: string;
  album: string;
  cover: string;
  correctStatus?: 'CORRECT' | 'ALBUM' | 'WRONG' | string;
}

export default function GuessCard({ name, album, cover, correctStatus }: IProps) {
  const getIcon = () => {
    switch (correctStatus) {
      case 'CORRECT':
        return <FontAwesomeIcon icon={faCheck} style={{ color: '#52fa7c' }} />;
      case 'ALBUM':
        return <FontAwesomeIcon icon={faX} style={{ color: '#ffa257' }} />;
      case 'WRONG':
        return <FontAwesomeIcon icon={faX} style={{ color: '#ff5757' }} />;
      default:
        return <span className="loading loading-ring loading-xs"></span>;
    }
  };

  const getTooltip = () => {
    switch (correctStatus) {
      case 'CORRECT':
        return 'You got it!';
      case 'ALBUM':
        return 'Same album...';
      case 'WRONG':
        return 'Nope!';
    }
  };

  return (
    <div className="card card-side bg-base-100 shadow-xl w-full">
      <figure>
        <Image src={cover} alt={name} height={50} width={50} />
      </figure>
      <div className="flex items-center w-full justify-between px-4">
        <div className="tooltip" data-tip={`from ${album}`}>
          <h2 className="card-title">{name}</h2>
        </div>
        <div className="tooltip" data-tip={getTooltip()}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
}
