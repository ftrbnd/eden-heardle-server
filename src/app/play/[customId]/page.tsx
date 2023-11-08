import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import CustomHeardlePageContent from './CustomHeardlePageContent';
import CustomHeardleModal from '@/components/modals/CustomHeardleModal';

export default function CustomHeardlePage({ params }: { params: { customId: string } }) {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <CustomHeardlePageContent params={params}>
      <RulesModal />
      <SettingsModal />
      <CustomHeardleModal />
    </CustomHeardlePageContent>
  );
}
