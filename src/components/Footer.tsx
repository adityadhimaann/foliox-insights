const Footer = () => (
  <footer className="px-6 md:px-10 py-12 pb-8 border-t border-border/40 relative z-2">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="font-heading text-xl">
          <span className="text-foreground">Folio</span>
          <span className="text-primary" style={{ textShadow: '0 0 12px rgba(0,229,160,0.4)' }}>X</span>
        </span>
      </div>
      <p className="font-body text-xs text-muted-foreground max-w-sm text-left md:text-right">
        Not SEBI registered financial advice. For educational purposes only.
      </p>
    </div>
  </footer>
);

export default Footer;
