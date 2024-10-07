import Navbar from "./Assets/components/Navbar/navbar";
import Topbar from "./Assets/components/Topbar/Topbar";

/**
 * Home component for the main landing page.
 *
 * This component displays the Topbar and Navbar as part of the main layout.
 *
 * @function Home
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
  return (
    <div>
      <Topbar />
      <Navbar />
    </div>
  );
}
