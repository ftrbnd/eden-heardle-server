import StatsModal from '@/components/modals/StatsModal';
import PlayContent from './PlayContent';

export default function Play() {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <PlayContent>
      <StatsModal />
    </PlayContent>
  );
}
