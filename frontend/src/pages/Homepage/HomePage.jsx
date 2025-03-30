import Hero from "../../components/home/hero";
import Introduction from "../../components/home/Introduction";
import RoomsList from "../../components/home/RoomsList";
import ServicesList from "../../components/home/ServicesList";
import Amenities from "../../components/home/Amentities";
import Gallery from "../../components/home/Gallery";
import Testimonials from "../../components/home/Testimonials";

import { useEffect } from "react";

export default function HomePage() {
  // Scroll to specific section if hash is present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Hero />
      <Introduction />
      <RoomsList featured={true} />
      <ServicesList featured={true} />
      <Amenities />
      <Gallery />
      <Testimonials />
    </>
  );
}
