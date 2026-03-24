import { DormDetailPage } from "@/components/modules/dorm/DormDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DormDetailRoutePage({ params }: Props) {
  const { slug } = await params;

  return <DormDetailPage dormId={slug} />;
}