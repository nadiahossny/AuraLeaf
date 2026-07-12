import StudyMode from "./components/StudyMode";
import "./App.css";
import {Mail, MessageCircle, Globe} from "lucide-react";

const Linkedin = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Github = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.18-.35 6.5-1.5 6.5-7.1a5.8 5.8 0 0 0-1.6-4.03 5.5 5.5 0 0 0-.15-3.98s-1.3-.4-4.2 1.6a14.8 14.8 0 0 0-8 0c-2.9-2-4.2-1.6-4.2-1.6a5.5 5.5 0 0 0-.15 3.98 5.8 5.8 0 0 0-1.6 4.03c0 5.6 3.3 6.75 6.5 7.1a4.8 4.8 0 0 0-1 3.02v4"></path>
    <path d="M9 20c-5 1.5-5-2.5-7-3"></path>
  </svg>
);

export default function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">🍃</span>
          <span className="brand-name">AuraLeaf</span>
        </div>
      </header>

      {/* Main Content */}
      <StudyMode name={"Guest"} />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-social-links">
          {[
            { Icon: Mail, href: "mailto:nadiahossy426@gmail.com" },
            { Icon: MessageCircle, href: "https://wa.me/201064943439" },
            { Icon: Linkedin, href: "https://linkedin.com/in/nadiahossny" },
            { Icon: Github, href: "https://github.com/nadiahossny" },
            { Icon: Globe, href: "https://nadiahossny.vercel.app" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
            >
              <Icon size={24} />
            </a>
          ))}
        </div>

        <p className="footer-copyright">
          © 2026 Nadia Hossny. Made with <span className="footer-heart">💖</span>
        </p>
      </footer>
    </div>
  );
}