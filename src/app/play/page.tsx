import PlayContent from './PlayContent';
import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import LeaderboardModal from '@/components/modals/LeaderboardModal';

export default function Play() {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <PlayContent>
      <LeaderboardModal />
      <RulesModal />
      <SettingsModal />
    </PlayContent>
  );
}
