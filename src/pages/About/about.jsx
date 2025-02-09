import { motion } from "framer-motion";

import about1 from "../../assets/about-banner.webp";
import about from "../../assets/about1.webp"
import about2 from "../../assets/about2.webp";
import about3 from "../../assets/about3.webp";
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
const AboutPage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative ">
       <img
          src={about1 }
          alt="Fashion brand hero image"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 " />
        {/* Centered Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white text-center px-4 tracking-wide">
            About Us
          </h1>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="pt-10 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">Our Story</h2>
          <p className="font-sans text-sm text-gray-600 mb-8 tracking-wide">
            THE ONS JOURNEY BEGAN AS A MENSWEAR BRAND IN 2016 FOCUSED ON VERSATILE STYLING, A CONSISTENT FIT AND
            COMFORTABLE FABRICS.
          </p>
          <p className="font-sans text-sm text-gray-600 tracking-wide">
            OUR MISSION IS TO EMPOWER YOU TO GO PLACES, OFFERING COMFORTABLE AND VERSATILE GARMENTS THAT LAYER INTO YOUR
            EVERYDAY LIFE. WE WANT YOU TO FEEL PROUD OF WHAT YOU WEAR, KNOWING WE ARE MINDFUL OF OUR PROCESS AND
            MANUFACTURING DOWN TO THE VERY LAST STITCH.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[400px] mb-16 overflow-hidden"
        >
          <img
            src={about}
            alt="Fashion lifestyle showcase"
            className="w-full h-full object-cover "
          />
        </motion.div>
      </section>
      {/* Manufacturing Section */}
      <section className=" px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-sm text-gray-600 tracking-wide">
            BUILT WITH THE INTENTION TO SHOWCASE HIGH STANDARDS IN SPECIALTY MANUFACTURING, OUR IN-HOUSE PRODUCT DEVELOPMENT TEAM HAND SELECTS EACH SILHOUETTE, FABRIC AND HARDWARE WITH THE UTMOST INTEGRITY AND ATTENTION TO DETAIL. BALANCING SUSTAINABILITY AND SOCIAL RESPONSIBILITY, WE ENSURE OUR PRACTICES GO BEYOND WORDS, SETTING PARAMETERS THAT NEVER COMPROMISE QUALITY AND ETHICAL INTEGRITY.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative  w-full "
        >
          <img
            src={about2}
            alt="Manufacturing process"
            fill
            className="object-cover grayscale"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-10 text-center space-y-8"
        >
          <p className="font-sans text-sm text-gray-600 tracking-wide">
            SINCE OUR INCEPTION, WE WANT TO BRING OUR ETHOS FROM YOUR WARDROBE TO EVERY PART OF YOUR HOME. EVOLVING FROM ONE NICE SHIRT TO ONE NICE SHOP
          </p>
          <p className="font-sans text-sm text-gray-600 tracking-wide">
            ONE NICE SHOP IS OUR CONCEPT STORE IN NEW YORK CITY. CURATED WITH LOVE AND CARE TO SHOWCASE BRANDS WE BELIEVE FITTING TO OUR ETHOS.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full mt-16"
        >
          <img
            src={about3}
            alt="Our concept store"
            fill
            className="object-cover"
          />
        </motion.div>
      </section>
      <section className="pt-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-sans text-sm text-gray-600 tracking-wide">
          JOIN OUR JOURNEY ON FINDING QUALITY GOODS FROM AROUND THE AROUND!
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
        <FeatureCard icon={Truck} text="Free domestic delivery on $150+" />
        <FeatureCard icon={MapPin} text="Your nearest store" />
        <FeatureCard icon={Tag} text="Gift cards" />
      </div>
    </section>
    </main>
  );
};

export default AboutPage;
