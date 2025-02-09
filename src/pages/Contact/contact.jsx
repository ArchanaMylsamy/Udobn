import { motion } from "framer-motion";
import contact from '../../assets/contact.webp';
import { Truck, MapPin, Tag } from "lucide-react"
const FeatureCard = ({ icon: Icon, text }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center space-y-4"
    >
      <div className="p-2">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-gray-600 text-sm md:text-base tracking-wide">{text}</p>
    </motion.div>
  )
export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container px-4 mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-light text-center mb-12">Contact Us</h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 md:gap-12">
          {/* Left Column - Store Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-600 text-md">
              If you have any questions, please do not hesitate to send us a message
            </p>

            <div className="relative h-[150px] w-[350px]  overflow-hidden ">
              <img
                src={contact}
                alt="O.N.S Flagship Store"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-gray-600">
              <p className="font-medium">O.N.S Flagship</p>
              <p>201 Mulberry St, New York, NY 10012</p>
              <p>Phone: 646.609.2626</p>
              <p>MON–SAT 11a–7p, SUN 12p–6p</p>
            </div>

            <a
              href="/locations"
              className="inline-block text-gray-600 hover:text-gray-900 underline underline-offset-4"
            >
              Visit our retail locations
            </a>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-light mb-6">Contact us</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-600">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-600">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full p-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <button
                type="submit"
                className="w-32 bg-black text-white hover:bg-black/90 rounded-md py-1.5 transition-colors duration-200"
              >
                Send
              </button>
            </form>
          </motion.div>
        </div>
      </motion.div>
      <div className="pt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
        <FeatureCard icon={Truck} text="Free domestic delivery on $150+" />
        <FeatureCard icon={MapPin} text="Your nearest store" />
        <FeatureCard icon={Tag} text="Gift cards" />
      </div>
    </main>
  );
}
