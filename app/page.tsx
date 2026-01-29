import { UserGaurd } from "@/components/user-gaurd";
import { UserDashboardContent } from "@/components/user/dashboard-content";

export default function Home() {
  return (
    <UserGaurd>
       <UserDashboardContent />
    </UserGaurd>
  );
}
