import PlayContent from './_content';
import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import LeaderboardModal from '@/components/modals/LeaderboardModal';
import CustomHeardleModal from '@/components/modals/CustomHeardleModal';

export default function Play() {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <PlayContent>
      <LeaderboardModal />
      <RulesModal />
      <SettingsModal />
      <CustomHeardleModal />
    </PlayContent>
  );
}
