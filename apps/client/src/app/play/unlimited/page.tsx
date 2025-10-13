import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import { Metadata } from 'next';
import UnlimitedPageContent from './content';

export function generateMetadata(): Metadata {
  return {
    title: 'Unlimited EDEN Heardle'
  };
}

export default function CustomHeardlePage() {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <UnlimitedPageContent>
      <RulesModal />
      <SettingsModal />
    </UnlimitedPageContent>
  );
}
