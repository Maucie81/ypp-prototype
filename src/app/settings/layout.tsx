import { UsersProvider } from "@/contexts/UsersContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UsersProvider>{children}</UsersProvider>;
}
