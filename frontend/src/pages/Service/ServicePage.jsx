import ServicesList from "../../components/home/ServicesList";
import { useState, useEffect } from "react";
import { mockServices } from "../../mock/service";

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      setServices(mockServices);
    }, 1000);
  }, []);
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Premium Services
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Indulge in our range of exclusive services designed to enhance your
            stay and create unforgettable memories at Elysian Retreat.
          </p>
        </div>
      </div>

      <ServicesList featured={false} services={services} />
    </div>
  );
}

export default ServicesPage;
