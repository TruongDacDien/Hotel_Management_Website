import { useEffect, useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { HOTEL_INFO, SOCIAL_LINKS } from "../../lib/constants";

export default function ContactPage() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (formValues.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formValues.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters.";
    }
    if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log(formValues);
      setSubmitted(true);
      alert("Thank you for your message. We'll get back to you shortly.");
      setFormValues({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div className="pt-24">
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            We're here to help make your stay perfect. Reach out with any
            questions, special requests, or to book your next luxurious
            experience.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <ContactInfoCard icon={<MapPin size={24} />} title="Our Location">
              <p>{HOTEL_INFO.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  HOTEL_INFO.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Get Directions
              </a>
            </ContactInfoCard>

            <ContactInfoCard icon={<Phone size={24} />} title="Call or Email">
              <p>
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="hover:text-primary"
                >
                  {HOTEL_INFO.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  className="hover:text-primary"
                >
                  {HOTEL_INFO.email}
                </a>
              </p>
            </ContactInfoCard>

            <ContactInfoCard icon={<Clock size={24} />} title="Opening Hours">
              <p>
                <strong>Front Desk:</strong> 24/7
              </p>
              <p>
                <strong>Restaurant:</strong> 6:30 AM - 10:30 PM
              </p>
              <p>
                <strong>Spa:</strong> 9:00 AM - 8:00 PM
              </p>
            </ContactInfoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="name"
                    label="Name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                  <InputField
                    name="email"
                    label="Email"
                    value={formValues.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="phone"
                    label="Phone (Optional)"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                  <InputField
                    name="subject"
                    label="Subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    error={errors.subject}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formValues.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full border rounded-lg p-2 resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Google Map + Social */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Find Us</h2>
              <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231171235212!2d106.80047917451817!3d10.870014157461519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1744712997639!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Location"
                ></iframe>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <SocialIcon link={SOCIAL_LINKS.facebook}>
                    <Facebook size={20} />
                  </SocialIcon>
                  <SocialIcon link={SOCIAL_LINKS.twitter}>
                    <Twitter size={20} />
                  </SocialIcon>
                  <SocialIcon link={SOCIAL_LINKS.instagram}>
                    <Instagram size={20} />
                  </SocialIcon>
                  <SocialIcon link="#">
                    <Linkedin size={20} />
                  </SocialIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Find quick answers to common questions about Elysian Retreat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FaqItem
            question="What are your check-in and check-out times?"
            answer="Check-in is available from 3:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out may be arranged based on availability."
          />
          <FaqItem
            question="Is breakfast included with the room?"
            answer="Yes, a complimentary gourmet breakfast is included with all room bookings. Room service is available for in-room dining."
          />
          <FaqItem
            question="Do you offer airport transfers?"
            answer="Yes, we provide airport transfers for an additional fee. Please contact our concierge at least 24 hours in advance to arrange this service."
          />
          <FaqItem
            question="Is there a cancellation fee?"
            answer="Cancellations made more than 48 hours before check-in are fully refundable. Cancellations within 48 hours may incur a one-night charge."
          />
        </div>
      </section>
    </div>
  );
}

// Reusable Components
function InputField({ name, label, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-2"
        placeholder={`Your ${name}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function ContactInfoCard({ icon, title, children }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="text-neutral-700">{children}</div>
    </div>
  );
}

function SocialIcon({ link, children }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300"
    >
      {children}
    </a>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-3 text-primary">{question}</h3>
      <p className="text-neutral-700">{answer}</p>
    </div>
  );
}
