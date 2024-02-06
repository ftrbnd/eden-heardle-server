import RulesModal from '@/components/modals/RulesModal';
import SettingsModal from '@/components/modals/SettingsModal';
import CustomHeardlePageContent from './content';
import CustomHeardleModal from '@/components/modals/CustomHeardleModal';
import { Metadata } from 'next';
import prisma from '@/utils/db';

interface CustomPageProps {
  params: { customId: string };
}

export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  const customHeardle = await prisma.customHeardle.findUnique({
    where: {
      id: params.customId
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
    title: `${customHeardle?.user.name}'s Custom EDEN Heardle`
  };
}

export default function CustomHeardlePage({ params }: CustomPageProps) {
  return (
    // https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props
    <CustomHeardlePageContent params={params}>
      <RulesModal />
      <SettingsModal />
      <CustomHeardleModal />
    </CustomHeardlePageContent>
  );
}
