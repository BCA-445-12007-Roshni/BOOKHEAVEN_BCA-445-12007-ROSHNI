import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";

const Footer = () => {
  const linkSelections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"],
    },
    {
      title: "Need Help?",
      links: [
        "Delivery Information",
        "Return & Refund Policy",
        "Payment Methods",
        "Track your Orders",
        "Contact Us",
      ],
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "Youtube"],
    },
  ];

  return (
    <footer className="max-w-[1550px] px-6 lg:px-12 bg-gradient-to-l from-primary via-white to-primary mx-auto" >
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30">
        <div>
          {/* LOGO */}
          <div className="flex-flex-1">
            <Link to={"/"} className="bold-22 xl:bold-28 flex items-end gap-1">
              <img src={logoImg} alt="" className="h-9" />
              <div className="relative top-1.5">
                Book<span className="text-secondary">Heaven</span>
              </div>
            </Link>
          </div>
          <p className="max-w-[410px] mt-6">
            Discover stylish clothing and shoes online, crafted for comfort and
            quality. Shop fashion-forward designs that elevate your look and fit
            every lifestyle.
          </p>
        </div>
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {linkSelections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="hover:underline transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center">
        Copyright 2025 © Roshni All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
