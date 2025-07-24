import React from "react";
import FitifyLogo from "../FitifyLogo/FitifyLogo";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-10 px-6 border-t border-gray-300 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Info */}
        <div>
          <FitifyLogo />
          <p className="text-sm text-gray-600 mt-2">
            Your fitness companion. Stay active, stay fit.
          </p>
          <p className="text-xs mt-4 text-gray-500">
            © 2025 Fitify. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="footer-title mb-3 text-lg font-semibold text-gray-800">
            Quick Links
          </h6>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-trainers" className="hover:text-primary">
                All Trainers
              </Link>
            </li>
            <li>
              <Link to="/all-classes" className="hover:text-primary">
                All Classes
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-primary">
                Community/Forum
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/my-profile" className="hover:text-primary">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h6 className="footer-title mb-3 text-lg font-semibold text-gray-800">
            Company
          </h6>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <a className="hover:text-primary cursor-pointer">About Us</a>
            </li>
            <li>
              <a className="hover:text-primary cursor-pointer">Contact</a>
            </li>
            <li>
              <a className="hover:text-primary cursor-pointer">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-primary cursor-pointer">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h6 className="footer-title mb-3 text-lg font-semibold text-gray-800">
            Contact
          </h6>
          <p className="text-sm text-gray-700">📍 Sylhet, Bangladesh</p>
          <p className="text-sm text-gray-700">✉️ support@fitify.com</p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/questcoderul"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://github.com/questcoderull"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition"
            >
              <FaGithub size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              <FaLinkedin size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
