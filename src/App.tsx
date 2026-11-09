import { useEffect, useRef, useState } from 'react';
import { products, type Product } from './data/products';

const navItems = [
  { href: '#collection', label: 'The collection' },
  { href: '#materials', label: 'Materials' },
  { href: '#about', label: 'Our story' },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="arrow-icon">
      <path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloverMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 19C13 9 9 8 5 11c-5 5 1 12 13 10C9 26 8 31 12 35c5 4 12-2 9-14 6 11 12 14 16 9 4-5-2-11-16-10C33 14 34 9 29 6c-5-3-10 3-9 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M20 20c.5 5 2 10 6 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="announcement">
        <span className="announcement-mark" aria-hidden="true">✳</span>
        An open notebook of objects in the making
        <a href="#collection">Explore the first studies <span aria-hidden="true">↗</span></a>
      </div>
      <header className="site-header">
        <div className="header-inner container">
          <a href="#top" className="brand-lockup" aria-label="Sown and Shaped, home" onClick={() => setMenuOpen(false)}>
            <span className="brand-symbol" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
            <span>SOWN <span className="brand-amp">&</span> SHAPED<span className="brand-dot">.</span></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <a className="nav-action" href="#newsletter">Get the first look <Arrow diagonal /></a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span></span><span></span>
          </button>
        </div>
        <nav id="mobile-navigation" className={'mobile-nav' + (menuOpen ? ' is-open' : '')} aria-label="Mobile navigation" inert={!menuOpen}>
          {navItems.map(item => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label} <Arrow diagonal /></a>)}
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>Get the first look <Arrow diagonal /></a>
        </nav>
      </header>
    </>
  );
}

function ProductDialog({ product, onClose, onNotify }: { product: Product; onClose: () => void; onNotify: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLButtonElement>('.dialog-close')?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !ref.current) return;
      const focusable = [...ref.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={ref} className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close product preview"><span aria-hidden="true">×</span></button>
        <div className="dialog-image-wrap">
          <img src={product.image} alt={product.imageAlt} />
          <span className="image-status">Concept visual · Not a product photo</span>
        </div>
        <div className="dialog-content">
          <p className="eyebrow">Study {product.number} / {product.category}</p>
          <span className="concept-pill">In development</span>
          <h2 id="dialog-title">{product.name}</h2>
          <p className="dialog-subtitle">{product.subtitle}</p>
          <p id="dialog-description">{product.description}</p>
          <div className="dialog-spec">
            <span>Material exploration</span>
            <strong>{product.material}</strong>
          </div>
          <div className="dialog-notes">
            <span>What we're testing</span>
            <ul>{product.studyNotes.map(note => <li key={note}>{note}</li>)}</ul>
          </div>
          <button type="button" className="button button-ink dialog-cta" onClick={onNotify}>Get the first look <Arrow diagonal /></button>
          <p className="dialog-fineprint">Design study only. Not currently available for sale.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const productTrigger = useRef<HTMLButtonElement | null>(null);

  function openProduct(product: Product, source: HTMLButtonElement) {
    productTrigger.current = source;
    setSelectedProduct(product);
  }
  function closeProduct() {
    setSelectedProduct(null);
    window.requestAnimationFrame(() => productTrigger.current?.focus());
  }
  function notifyFromDialog() {
    setSelectedProduct(null);
    window.requestAnimationFrame(() => {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      document.getElementById('email')?.focus({ preventScroll: true });
    });
  }
  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    setFormMessage('Thank you for the interest. This is a prototype, so no email was collected or saved. Signups are not live yet.');
  }

  return (
    <div id="top">
      <SiteHeader />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-index"><span className="blue-thread" aria-hidden="true"></span> Plant materials, reimagined <span className="index-number">/ 001</span></p>
            <h1 id="hero-title">Better things<br /><em>take root.</em></h1>
            <p className="hero-belief">Grown from the field. <br />Made for everyday.</p>
            <p className="hero-description">We turn familiar plant materials into thoughtful objects for the spaces we live in. A little unexpected. Made to feel at home.</p>
            <div className="hero-actions">
              <a className="button button-ink" href="#collection">Explore the concepts <Arrow /></a>
              <a className="text-link" href="#materials">Meet the materials <Arrow diagonal /></a>
            </div>
            <div className="hero-bottom"><span className="fine-rule"></span><span>Made from a closer look at nature.</span><span>Scroll to discover ↓</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img src="/images/hero-study.svg" alt="Art-directed illustration of a textured loofah object, a folded corn husk and a fine cobalt-blue stitch in a quiet still life." />
              <span className="visual-top-label">S&S / Material study Nº 01</span>
              <div className="visual-frame-mark top-left" aria-hidden="true"></div>
              <div className="visual-frame-mark bottom-right" aria-hidden="true"></div>
            </div>
            <div className="visual-caption"><span>01 — FORM FROM FIBER</span><span>Concept artwork / Material exploration</span></div>
          </div>
        </section>

        <section className="collection section-space" id="collection" aria-labelledby="collection-heading">
          <div className="container">
            <div className="section-heading collection-heading">
              <div><p className="eyebrow">01 / The first studies</p><h2 id="collection-heading">A few good things<br /><em>in the making.</em></h2></div>
              <p>Three starting points, one simple curiosity: what might the things we know from the field become in our homes?</p>
            </div>
            <div className="product-grid">
              {products.map(product => (
                <article className={'product-card product-' + product.id} key={product.id}>
                  <button className="product-image-button" type="button" onClick={event => openProduct(product, event.currentTarget)} aria-label={'Explore the concept: ' + product.name}>
                    <span className="product-image">
                      <img loading="lazy" src={product.image} alt={product.imageAlt} />
                      <span className="card-float-label">CONCEPT / {product.number}</span>
                      <span className="product-open-icon"><Arrow diagonal /></span>
                    </span>
                  </button>
                  <div className="product-meta"><span>{product.number} / {product.category}</span><span>Material study</span></div>
                  <div className="product-title-row"><h3>{product.name}</h3><button type="button" className="inline-icon-button" aria-label={'Read about ' + product.name} onClick={event => openProduct(product, event.currentTarget)}><Arrow diagonal /></button></div>
                  <p>{product.subtitle}</p>
                  <p className="product-material">{product.material}</p>
                </article>
              ))}
            </div>
            <div className="collection-footnote"><span className="cobalt-star" aria-hidden="true">✳</span><p>These are early design explorations, not finished products or available inventory. We're sharing the process as it takes shape.</p><a href="#newsletter" className="text-link">Follow the journey <Arrow diagonal /></a></div>
          </div>
        </section>

        <section className="materials section-space" id="materials" aria-labelledby="materials-heading">
          <div className="container">
            <div className="section-heading material-heading">
              <p className="eyebrow">02 / The materials</p>
              <h2 id="materials-heading">The familiar,<br /><em>seen differently.</em></h2>
              <p>We begin with what is already there: the texture of a dried gourd, the quiet structure of a leaf. Their character is our starting point.</p>
            </div>
            <div className="material-features">
              <article className="material-feature">
                <div className="material-image"><img src="/images/loofah-fiber.svg" loading="lazy" alt="Illustrated close-up study of the tangled honey-colored fiber network inside dried loofah." /><span className="material-image-code">M / 01</span></div>
                <div className="material-text"><div className="material-headline"><h3>Loofah <em>/</em> 丝瓜络</h3><span>01</span></div><p>The inside of a mature dried gourd forms an airy, intertwined network. Light, fibrous, and full of small irregularities, it invites us to rethink surfaces, sleeves, and useful everyday textures.</p><p className="micro-label">FIBROUS · OPEN · TACTILE</p></div>
              </article>
              <article className="material-feature material-feature-offset">
                <div className="material-image"><img src="/images/corn-husk.svg" loading="lazy" alt="Illustrated macro study of layered corn husks showing long veins, folds and warm straw tones." /><span className="material-image-code">M / 02</span></div>
                <div className="material-text"><div className="material-headline"><h3>Corn husk <em>/</em> 玉米皮</h3><span>02</span></div><p>The leaves that wrap an ear of corn have their own soft stiffness and long, directional grain. Folded, layered, or woven, they suggest forms that are humble, expressive, and surprisingly architectural.</p><p className="micro-label">LAYERED · FLEXIBLE · STRUCTURED</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="principles section-space" id="process" aria-labelledby="principles-heading">
          <div className="container principle-layout">
            <div className="principle-intro">
              <p className="eyebrow">03 / Our approach</p>
              <h2 id="principles-heading">Material first.<br /><em>Life always.</em></h2>
              <p>Not everything needs to be reinvented. Sometimes a new object begins by paying closer attention.</p>
              <div className="process-art"><img src="/images/process-study.svg" loading="lazy" alt="Minimal line drawing of three explorations: observing a plant fiber, folding a sheet, and testing a bowl-like form." /><span>NOTES FROM THE WORKTABLE / 001—003</span></div>
            </div>
            <ol className="principle-list">
              <li><span className="principle-num">01 /</span><div><h3>Notice the material.</h3><p>Begin with touch, grain, flexibility, and the traces nature leaves behind.</p></div><span className="principle-mark" aria-hidden="true">↗</span></li>
              <li><span className="principle-num">02 /</span><div><h3>Make, then remake.</h3><p>Sketch, fold, stitch, prototype. Find a form that feels honest to its material.</p></div><span className="principle-mark" aria-hidden="true">↗</span></li>
              <li><span className="principle-num">03 /</span><div><h3>Bring it into the everyday.</h3><p>Ask how it rests, works, feels in the hand, and earns a place at home.</p></div><span className="principle-mark" aria-hidden="true">↗</span></li>
            </ol>
          </div>
        </section>

        <section className="story section-space" id="about" aria-labelledby="story-heading">
          <div className="container story-layout">
            <div className="story-side"><p className="eyebrow">04 / A note from the beginning</p><div className="story-stitch" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><span>ROOTS / ROUTINES</span></div>
            <div className="story-main">
              <h2 id="story-heading">From where<br />we come from,<br /><em>to how we live.</em></h2>
              <div className="story-columns"><p>Some materials are so familiar that we stop seeing them. Loofah and corn husk belonged to the everyday landscape of our founder's hometown long before they became ideas for objects.</p><p>Sown & Shaped begins with that second look. We bring the memory of the field into contemporary homes, not as nostalgia, but as useful forms worth keeping around.</p></div>
              <span className="story-signoff">SOWN & SHAPED — A BRAND IN THE MAKING</span>
            </div>
          </div>
        </section>

        <section className="newsletter section-space" id="newsletter" aria-labelledby="newsletter-heading">
          <div className="container newsletter-layout">
            <div><p className="eyebrow"><span className="blue-thread" aria-hidden="true"></span> Stay close to the process</p><h2 id="newsletter-heading">Good things<br /><em>are growing.</em></h2><p>New material studies, small experiments, and first looks at what's next. A note every now and then, when we have something to share.</p></div>
            <div className="signup-panel">
              <p className="signup-label">BE FIRST TO KNOW</p>
              <form onSubmit={handleSubscribe}>
                <label htmlFor="email">Your email address</label>
                <div className="email-field"><input id="email" type="email" name="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); if (formMessage) setFormMessage(''); }} /><button type="submit" aria-label="Preview early access signup"><Arrow /></button></div>
              </form>
              <p className="signup-disclosure">Preview only — the email list isn't live. No addresses are collected or stored.</p>
              <p className="signup-feedback" role="status" aria-live="polite">{formMessage}</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top"><a className="footer-logo" href="#top">SOWN <span>&</span> SHAPED<span className="brand-dot">.</span></a><p>Grown from the field.<br />Made for everyday.</p></div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Sown & Shaped. An independent concept in progress.</span>
            <nav aria-label="Footer navigation"><a href="#collection">Collection</a><a href="#materials">Materials</a><a href="#process">Approach</a><a href="#about">Story</a><a href="#top">Back to top ↑</a></nav>
          </div>
        </div>
      </footer>
      {selectedProduct && <ProductDialog product={selectedProduct} onClose={closeProduct} onNotify={notifyFromDialog} />}
    </div>
  );
}

export default App;
