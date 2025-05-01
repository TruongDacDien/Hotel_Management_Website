import ServicesList from "../../components/home/ServicesList";
import { useState, useEffect } from "react";
import { getAllServices } from "../../config/api";

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        if (response) {
          console.log(response);
          setServices(response);
        }
      } catch {
        throw new Error("There is an error while getting room");
      }
    };
    fetchServices();
  }, []);
  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Dịch vụ cao cấp
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Hãy tận hưởng nhiều dịch vụ độc quyền của chúng tôi được thiết kế để
            nâng cao kỳ nghỉ của bạn và tạo nên những kỷ niệm khó quên tại
            Elysian Retreat.
          </p>
        </div>
      </div>

      <ServicesList featured={false} services={services} />
    </div>
  );
}

export default ServicesPage;
