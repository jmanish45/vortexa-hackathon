import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollValue = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${
          scrollValue * 0.4
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center bg-gradient-to-r from-primary-800 to-primary-600 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40" />
          <img
            src="/pattern.jpg"
            alt=""
            className="w-full h-full object-cover scale-110 contrast-125 brightness-50"
          />
        </div>

        <div className="container-custom relative z-10 px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.215, 0.61, 0.355, 1],
                  },
                },
              }}
            >
              Plant Disease Detection{" "}
              <span className="block mt-2 text-secondary-500 drop-shadow-lg">
                for Farmers
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 1, delay: 0.2 },
                },
              }}
            >
              Identify plant diseases quickly and get effective remedies to
              protect your crops and maximize your yields
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.5 },
                },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/diagnosis"
                className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white text-lg font-semibold px-10 py-4 rounded-full transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Diagnose Your Plant
                <span className="ml-2">→</span>
              </Link>
            </motion.div>

            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.5,
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg
                className="w-10 h-10 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        className="py-24 container-custom"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <motion.h2
          className="text-3xl md:text-5xl text-center mb-24 font-bold text-gray-800 relative"
          variants={fadeInUp}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
            Powerful Features
          </span>{" "}
          for Farmers
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-secondary-500 rounded-full"></span>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-10"
          variants={staggerContainer}
        >
          <motion.div
            className="card hover:shadow-hover transition-all duration-500 group border-t-4 border-primary-500 hover:-translate-y-2"
            variants={fadeInUp}
          >
            <div className="bg-primary-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
              Disease Detection
            </h3>
            <p className="text-gray-600 text-lg">
              Upload images of your plants to identify diseases with high
              accuracy using our advanced AI technology
            </p>
          </motion.div>

          <motion.div
            className="card hover:shadow-hover transition-all duration-500 group border-t-4 border-primary-500 hover:-translate-y-2"
            variants={fadeInUp}
          >
            <div className="bg-primary-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
              Expert Remedies
            </h3>
            <p className="text-gray-600 text-lg">
              Get scientifically-backed treatment methods for plant diseases to
              effectively protect your crops
            </p>
          </motion.div>

          <motion.div
            className="card hover:shadow-hover transition-all duration-500 group border-t-4 border-primary-500 hover:-translate-y-2"
            variants={fadeInUp}
          >
            <div className="bg-primary-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-all duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
              Community Support
            </h3>
            <p className="text-gray-600 text-lg">
              Connect with other farmers to share knowledge and experiences
              about plant health management
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl text-center mb-20 font-bold text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="relative">
              How It Works
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-secondary-500 rounded-full"></span>
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 z-0"></div>

            <motion.div
              className="card relative z-10 hover:shadow-lg hover:border-primary-300 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white text-2xl font-bold mb-6 mx-auto shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                1
              </motion.div>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Upload Plant Image
              </h3>
              <p className="text-gray-600 text-center text-lg">
                Take a clear photo of your affected plant and upload it to our
                platform
              </p>
            </motion.div>

            <motion.div
              className="card relative z-10 hover:shadow-lg hover:border-primary-300 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white text-2xl font-bold mb-6 mx-auto shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                2
              </motion.div>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Provide Details
              </h3>
              <p className="text-gray-600 text-center text-lg">
                Add environmental data like temperature and soil type for more
                accurate diagnosis
              </p>
            </motion.div>

            <motion.div
              className="card relative z-10 hover:shadow-lg hover:border-primary-300 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white text-2xl font-bold mb-6 mx-auto shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                3
              </motion.div>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Get Results
              </h3>
              <p className="text-gray-600 text-center text-lg">
                Receive disease identification and detailed treatment
                recommendations instantly
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link
              to="/diagnosis"
              className="btn btn-primary px-8 py-4 text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">Try It Now</span>
              <span className="absolute inset-0 bg-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out group-hover:origin-left"></span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 container-custom">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-5xl text-center font-bold text-gray-800 mb-6">
            What Farmers Say
          </h2>

          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
            Hear from farmers who have used our platform to identify and treat
            plant diseases
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-500"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-secondary-300 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
              "This tool helped me identify rust disease in my wheat crop early,
              saving me from significant losses. The treatment advice was
              practical and effective."
            </p>

            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">
                RK
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Raj Kumar</h4>
                <p className="text-sm text-gray-500">Wheat Farmer, Punjab</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-secondary-300 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
              "The community section connected me with experienced farmers who
              guided me through managing tomato leaf curl virus. Invaluable
              resource!"
            </p>

            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">
                AS
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Anita Sharma</h4>
                <p className="text-sm text-gray-500">
                  Vegetable Grower, Karnataka
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card bg-gradient-to-br from-white to-gray-50 border-l-4 border-secondary-500 hover:shadow-xl transition-all duration-500"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-secondary-300 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
              "The disease predictions have been surprisingly accurate. I've
              reduced my pesticide usage by 30% by getting precise diagnoses and
              targeted treatment plans."
            </p>

            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">
                MP
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Manish Patel</h4>
                <p className="text-sm text-gray-500">Cotton Grower, Gujarat</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-primary-700 to-primary-800 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30"></div>
          <svg
            className="absolute bottom-0 left-0 right-0 text-white/10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Protect Your Crops?
            </motion.h2>

            <motion.p
              className="text-xl text-white/90 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Start using our AI-powered disease detection tool today and ensure
              the health of your plants
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/diagnosis"
                className="inline-block bg-white text-primary-700 hover:bg-gray-100 font-semibold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Diagnosis
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
