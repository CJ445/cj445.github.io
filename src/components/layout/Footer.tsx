const Footer = () => (
  <footer className="border-t border-primary/10 bg-surface">
    <div className="mx-auto w-full max-w-[70.9rem]">
      <div className="border-x border-primary/10">
        <p className="mx-auto max-w-3xl px-5 py-5 text-sm text-secondary sm:px-7">
          © {new Date().getFullYear()} Cyril Jacob
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
