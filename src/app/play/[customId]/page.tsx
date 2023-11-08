import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import CustomHeardlePageContent from './CustomHeardlePageContent';
import CustomHeardleModal from '@/components/modals/CustomHeardleModal';
import { Metadata, ResolvingMetadata } from 'next';
import prisma from '@/lib/db';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const customHeardle = await prisma.customHeardle.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
  if (!customHeardle) {
    return {
      title: 'Custom EDEN Heardle'
    };
  }

  return {
    title: `${customHeardle?.user.name}'s custom EDEN Heardle`
  };
}

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
