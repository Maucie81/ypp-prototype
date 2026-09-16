import { UserDetailContent } from "./UserDetailContent";

type PageProps = { params: Promise<{ id: string }> };

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <UserDetailContent key={id} id={id} />;
}
