import {
    BriefcaseBusiness,
    Facebook,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Browse Jobs", path: "/jobs" },
  { label: "About Us", path: "/about" },
  { label: "Contact Us", path: "/contact" },
];

const candidateLinks = [
  { label: "Candidate Dashboard", path: "/candidate/dashboard" },
  { label: "My Applications", path: "/candidate/applications" },
  { label: "Candidate Profile", path: "/candidate/profile" },
];

const employerLinks = [
  { label: "Employer Dashboard", path: "/employer/dashboard" },
  { label: "Post a Job", path: "/employer/jobs/create" },
  { label: "Manage Jobs", path: "/employer/jobs" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <BriefcaseBusiness size={21} />
            </span>

            <span>
              Job<span className="text-blue-400">Portal</span>
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            A modern job platform connecting qualified candidates with
            trusted employers and career opportunities.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-blue-700 hover:text-white"
            >
              <Facebook size={18} />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-blue-700 hover:text-white"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              className="rounded-lg bg-slate-900 p-2.5 transition hover:bg-blue-700 hover:text-white"
            >
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <FooterLinks title="Quick Links" links={quickLinks} />
        <FooterLinks title="For Candidates" links={candidateLinks} />
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-blue-400" />
              <span>support@jobportal.com</span>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-blue-400" />
              <span>+880 1700-000000</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-blue-400" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3 text-sm text-slate-400">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}