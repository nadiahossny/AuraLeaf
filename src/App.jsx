import StudyMode from "./components/StudyMode";
import "./App.css";
import {Mail, MessageCircle, Linkedin, Github, Globe} from "lucide-react";

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