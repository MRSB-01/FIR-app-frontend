import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              >
                Secure & Efficient FIR Management System
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl mb-8 text-blue-100"
              >
                File, track, and manage First Information Reports with our
                modern digital platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                  File FIR Now <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-blue-700 bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Track Existing FIR
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Police professionals working"
                className="rounded-xl shadow-2xl w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-5/6">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      24/7 Secure Access
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your data is protected
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
            >
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                10,000+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">FIRs Filed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
            >
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Availability</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
            >
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                500+
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Police Stations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
            >
              <div className="bg-amber-100 dark:bg-amber-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                85%
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Resolution Rate
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FIR Filing Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Streamlined processes for efficient law enforcement and public
            service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Online FIR Submission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Submit your FIR online with our secure platform. Get instant
              confirmation and reference number for tracking.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              File Now <ArrowRightIcon className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-green-100 dark:bg-green-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Track Your FIR
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Monitor the status of your FIR in real-time with our tracking
              system. Get updates at every stage of the process.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center transition-colors"
            >
              Track Status <ArrowRightIcon className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-purple-100 dark:bg-purple-900 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Emergency Services
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Immediate assistance for urgent situations. Connect directly with
              emergency response teams when every second counts.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center transition-colors"
            >
              Emergency Contact <ArrowRightIcon className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-6"
          >
            Need Immediate Assistance?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            Our support team is available 24/7 to help you with any emergency
            situation or technical issues.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Contact Support
            </button>
            <button className="bg-blue-700 bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Emergency Hotline
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-800 dark:bg-gray-900 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">FIR System</span>
              </div>
              <p className="text-gray-400 mb-4">
                A modern platform for efficient law enforcement and public
                safety services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    File FIR
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Track FIR
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Legal Information
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Safety Tips
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <a
                    href="tel:+911234567890"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +91 1234567890
                  </a>
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <a
                    href="mailto:support@firsystem.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    support@firsystem.com
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-gray-400">123 Police HQ, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 text-center">
            <p>
              &copy; {new Date().getFullYear()} FIR System. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
