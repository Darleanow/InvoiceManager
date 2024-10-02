import Navbar from "./Assets/components/Navbar/navbar";
import Topbar from "./Assets/components/Topbar/Topbar";
import SubNavigationBilling from "./Assets/components/SubNavigationBilling/SubNavigationBilling";

export default function Home() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <SubNavigationBilling />
    </div>
  );
}
