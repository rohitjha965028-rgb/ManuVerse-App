export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-surface-950">
      {/* Top accent line */}
      <div className="section-divider" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-text-secondary">Rohit Jha</span>. All rights
            reserved.
          </p>

          <p className="text-sm text-text-muted">
            Built with{" "}
            <span className="text-neon-cyan">Next.js</span>,{" "}
            <span className="text-neon-purple">Three.js</span> &amp;{" "}
            <span className="text-neon-pink">Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
