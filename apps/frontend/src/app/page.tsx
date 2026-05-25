import dynamic from 'next/dynamic';

const RoomExperience = dynamic(() => import('@/features/room/RoomExperience'), {
  ssr: false,
  loading: () => <main className="loading-screen">Preparing the room...</main>,
});

export default function HomePage() {
  return <RoomExperience />;
}
