import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HOTEL_INFO } from "../../lib/constants";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              About Elysian Retreat
            </h1>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Discover the story behind our luxury hotel, our values, and our
              commitment to providing exceptional experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Our Story
              </h2>
              <p className="text-neutral-700 mb-4">
                Founded in 2010, Elysian Retreat began with a vision to create a
                sanctuary of luxury and tranquility. What started as a boutique
                hotel with just 15 rooms has grown into a world-renowned
                destination for discerning travelers seeking the perfect blend
                of comfort, elegance, and exceptional service.
              </p>
              <p className="text-neutral-700 mb-4">
                Our name, "Elysian," was inspired by the concept of paradise in
                Greek mythology—a place of perfect happiness. This vision
                continues to guide our approach to hospitality, where every
                detail is crafted to create a transcendent experience for our
                guests.
              </p>
              <p className="text-neutral-700">
                Today, Elysian Retreat stands as a testament to our unwavering
                commitment to excellence, having received numerous accolades for
                our distinctive blend of luxury, personalized service, and
                sustainable practices.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Elysian Retreat Exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Values</h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              At the heart of Elysian Retreat are the core values that shape
              every aspect of our hospitality experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Exceptional Hospitality
              </h3>
              <p className="text-neutral-700">
                We believe in creating meaningful connections and memorable
                experiences through personalized service that anticipates and
                exceeds guest expectations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m7 10 3 3 7-7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Commitment to Excellence
              </h3>
              <p className="text-neutral-700">
                We are dedicated to maintaining the highest standards in every
                aspect of our operations, from the quality of our amenities to
                the professionalism of our staff.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c.3 0 4.3 6.9 4.3 6.9s7.9 1.1 7.9 1.4c0 .4-6 5-6 5s1.8 7.6 1.4 7.8c-.3.1-6.5-3.1-6.5-3.1S6.7 24 6.5 24c-.3 0 1-7.1 1-7.1s-6.8-5-6.8-5.3 8-1.2 8-1.2S11.7 3 12 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Environmental Stewardship
              </h3>
              <p className="text-neutral-700">
                We are committed to sustainable practices that minimize our
                environmental impact while enhancing the natural beauty that
                surrounds us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Our Leadership Team
            </h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Meet the passionate individuals guiding Elysian Retreat's
              commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="CEO Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Jonathan Miller</h3>
              <p className="text-primary font-medium mb-3">
                Chief Executive Officer
              </p>
              <p className="text-neutral-700">
                With over 25 years in luxury hospitality, Jonathan leads our
                vision of creating exceptional experiences for every guest.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="COO Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sophia Chen</h3>
              <p className="text-primary font-medium mb-3">
                Chief Operations Officer
              </p>
              <p className="text-neutral-700">
                Sophia ensures that our day-to-day operations consistently
                deliver the quality and service our guests expect.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  alt="Executive Chef Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Marcus Laurent</h3>
              <p className="text-primary font-medium mb-3">Executive Chef</p>
              <p className="text-neutral-700">
                A culinary master with international experience, Marcus creates
                the exquisite dining experiences Elysian Retreat is known for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Experience Elysian Retreat
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto mb-8">
            We invite you to discover the perfect blend of luxury, comfort, and
            exceptional service that defines the Elysian experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/rooms">
              <Button size="lg" className="text-base">
                Explore Our Rooms
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-base">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
