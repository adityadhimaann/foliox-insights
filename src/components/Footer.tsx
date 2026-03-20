const Footer = () => (
  <footer className="bg-bg-dark px-6 md:px-10 py-12 pb-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="font-heading text-xl text-primary-foreground">FolioX</span>
        <p className="font-body text-[13px] text-white/50 mt-1">Built for ET AI Hackathon 2026</p>
      </div>
      <p className="font-body text-xs text-white/40 max-w-sm text-left md:text-right">
        Not SEBI registered financial advice. For educational purposes only.
      </p>
    </div>
  </footer>
);

export default Footer;
