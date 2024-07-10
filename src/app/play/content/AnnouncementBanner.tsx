import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

interface AnnouncementProps {
  setShowBanner: Dispatch<SetStateAction<boolean>>;
  announcement: string;
}

export default function AnnouncementBanner({ setShowBanner, announcement }: AnnouncementProps) {
  const router = useRouter();

  const handleBannerClick = () => {
    router.push('https://discord.gg/futurebound');
  };

  return (
    <div className="flex justify-center items-center bg-error text-error-content w-full h-min p-2">
      <div onClick={handleBannerClick} className="btn btn-ghost px-1 sm:px-2">
        {announcement}
      </div>
      <button className="btn btn-ghost px-1 sm:px-2" onClick={() => setShowBanner(false)}>
        <FontAwesomeIcon icon={faClose} className="h-4 w-4" />
      </button>
    </div>
  );
}
