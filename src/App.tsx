import { useEffect, useRef, useState } from 'react';
import { siteCopy, type Language } from './data/copy';
import { products, type Product, type ProductCopy } from './data/products';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="arrow-icon">
      <path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg className="brand-symbol" aria-hidden="true" viewBox="0 0 40 40" fill="none">
      <path d="M20 4.5C12.2 9 11.1 15.1 20 20c8.9-4.9 7.8-11 0-15.5ZM35.5 20C31 12.2 24.9 11.1 20 20c4.9 8.9 11 7.8 15.5 0ZM20 35.5C27.8 31 28.9 24.9 20 20c-8.9 4.9-7.8 11 0 15.5ZM4.5 20C9 27.8 15.1 28.9 20 20c-4.9-8.9-11-7.8-15.5 0Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M20 4.5v31" stroke="#3152d8" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.6" fill="#3152d8" />
    </svg>
  );
}

function SparkIcon() {
  return <svg className="spark-icon" aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 1.75 11.7 8.3 18.25 10l-6.55 1.7L10 18.25 8.3 11.7 1.75 10 8.3 8.3 10 1.75Z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" /></svg>;
}

function LanguageSwitch({ language, onChange }: { language: Language; onChange: (language: Language) => void }) {
  const t = siteCopy[language];
  return (
    <div className="language-switch" role="group" aria-label={t.language}>
      <button type="button" lang="en" aria-pressed={language === 'en'} className={language === 'en' ? 'is-active' : ''} onClick={() => onChange('en')}>EN</button>
      <span aria-hidden="true"></span>
      <button type="button" lang="zh-CN" aria-pressed={language === 'zh'} className={language === 'zh' ? 'is-active' : ''} onClick={() => onChange('zh')}>中文</button>
    </div>
  );
}

function SiteHeader({ language, onLanguageChange }: { language: Language; onLanguageChange: (language: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = siteCopy[language];
  const navItems = [
    { href: '#collection', label: t.navCollection },
    { href: '#materials', label: t.navMaterials },
    { href: '#about', label: t.navStory },
  ];
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
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="announcement">
        <span className="announcement-mark"><SparkIcon /></span>
        {t.announcement}
        <a href="#collection">{t.announcementLink} <span aria-hidden="true">↗</span></a>
      </div>
      <header className="site-header">
        <div className="header-inner container">
          <a href="#top" className="brand-lockup" aria-label={t.home} onClick={() => setMenuOpen(false)}>
            <BrandMark />
            <span>SOWN <span className="brand-amp">&</span> SHAPED<span className="brand-dot">.</span></span>
          </a>
          <nav className="desktop-nav" aria-label={language === 'zh' ? '主导航' : 'Main navigation'}>
            {navItems.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>
          <a className="nav-action" href="#newsletter"><span>{t.firstLook}</span><Arrow diagonal /></a>
          <LanguageSwitch language={language} onChange={onLanguageChange} />
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            <span></span><span></span>
          </button>
        </div>
        <nav id="mobile-navigation" className={'mobile-nav' + (menuOpen ? ' is-open' : '')} aria-label={language === 'zh' ? '移动端导航' : 'Mobile navigation'}>
          {navItems.map(item => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label} <Arrow diagonal /></a>)}
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>{t.firstLook} <Arrow diagonal /></a>
        </nav>
      </header>
    </>
  );
}

function ProductDialog({ product, language, onClose, onExplore }: { product: Product; language: Language; onClose: () => void; onExplore: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = siteCopy[language];
  const content: ProductCopy = language === 'zh' ? product.zh : product;
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
        <button type="button" className="dialog-close" onClick={onClose} aria-label={t.closeProduct}><span aria-hidden="true">×</span></button>
        <div className="dialog-image-wrap">
          <img src={product.image} alt={content.imageAlt} />
        </div>
        <div className="dialog-content">
          <p className="eyebrow">{t.studyLabel} {product.number} / {content.category}</p>
          <span className="concept-pill">{t.studyInProgress}</span>
          <h2 id="dialog-title">{content.name}</h2>
          <p className="dialog-subtitle">{content.subtitle}</p>
          <p id="dialog-description">{content.description}</p>
          <div className="dialog-spec">
            <span>{t.materialExploration}</span>
            <strong>{content.material}</strong>
          </div>
          <div className="dialog-notes">
            <span>{t.whatTesting}</span>
            <ul>{content.studyNotes.map(note => <li key={note}>{note}</li>)}</ul>
          </div>
          <button type="button" className="button button-glass dialog-cta" onClick={onExplore}><span>{t.exploreMaterials}</span><Arrow diagonal /></button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return window.localStorage.getItem('sown-language') === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const t = siteCopy[language];
  const productTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t.pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.pageDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.pageDescription);
    try {
      window.localStorage.setItem('sown-language', language);
    } catch {}
  }, [language, t.pageDescription, t.pageTitle]);

  function openProduct(product: Product, source: HTMLButtonElement) {
    productTrigger.current = source;
    setSelectedProduct(product);
  }
  function closeProduct() {
    setSelectedProduct(null);
    window.requestAnimationFrame(() => productTrigger.current?.focus());
  }
  function exploreFromDialog() {
    setSelectedProduct(null);
    window.requestAnimationFrame(() => {
      document.getElementById('materials')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  return (
    <div id="top" className={language === 'zh' ? 'lang-zh' : ''}>
      <SiteHeader language={language} onLanguageChange={setLanguage} />
      <main id="main">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-index"><span className="blue-thread" aria-hidden="true"></span> {t.heroEyebrow} <span className="index-number">/ 001</span></p>
            <h1 id="hero-title">{t.heroHeadline1}<br /><em>{t.heroHeadline2}</em></h1>
            <p className="hero-belief">{t.heroBelief1}<br />{t.heroBelief2}</p>
            <p className="hero-description">{t.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-glass" href="#collection"><span>{t.exploreConcepts}</span><Arrow /></a>
              <a className="text-link" href="#materials">{t.meetMaterials} <Arrow diagonal /></a>
            </div>
            <div className="hero-bottom"><span className="fine-rule"></span><span>{t.heroBottom}</span><span>{t.scrollDiscover}</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img src="/images/hero-study.jpg" alt={language === 'zh' ? '以丝瓜络纤维与折叠玉米皮组合而成的雕塑感收纳器，点缀钴蓝色缝线。' : 'Sculptural catchall in open loofah fiber and folded corn husk, finished with a cobalt-blue stitch.'} />
              <span className="visual-top-label">{t.materialStudy}</span>
              <div className="visual-frame-mark top-left" aria-hidden="true"></div>
              <div className="visual-frame-mark bottom-right" aria-hidden="true"></div>
            </div>
            <div className="visual-caption"><span>{t.heroCaption1}</span><span>{t.heroCaption2}</span></div>
          </div>
        </section>

        <section className="collection section-space" id="collection" aria-labelledby="collection-heading">
          <div className="container">
            <div className="section-heading collection-heading">
              <div><p className="eyebrow">{t.collectionEyebrow}</p><h2 id="collection-heading">{t.collectionTitle1}<br /><em>{t.collectionTitle2}</em></h2></div>
              <p>{t.collectionSummary}</p>
            </div>
            <div className="product-grid">
              {products.map(product => {
                const content = language === 'zh' ? product.zh : product;
                return (
                <article className={'product-card product-' + product.id} key={product.id}>
                  <button className="product-image-button" type="button" onClick={event => openProduct(product, event.currentTarget)} aria-label={t.exploreConcept + content.name}>
                    <span className="product-image">
                      <img loading="lazy" src={product.image} alt={content.imageAlt} />
                      <span className="card-float-label">{t.formStudy} / {product.number}</span>
                      <span className="product-open-icon"><Arrow diagonal /></span>
                    </span>
                  </button>
                  <div className="product-meta"><span>{product.number} / {content.category}</span><span>{t.materialStudyLabel}</span></div>
                  <div className="product-title-row"><h3>{content.name}</h3><button type="button" className="inline-icon-button" aria-label={t.readAbout + ' ' + content.name} onClick={event => openProduct(product, event.currentTarget)}><Arrow diagonal /></button></div>
                  <p>{content.subtitle}</p>
                  <p className="product-material">{content.material}</p>
                </article>
                );
              })}
            </div>
            <div className="collection-footnote"><span className="cobalt-star"><SparkIcon /></span><p>{t.firstChapter}</p><a href="#materials" className="text-link">{t.meetMaterials} <Arrow diagonal /></a></div>
          </div>
        </section>

        <section className="materials section-space" id="materials" aria-labelledby="materials-heading">
          <div className="container">
            <div className="section-heading material-heading">
              <p className="eyebrow">{t.materialsEyebrow}</p>
              <h2 id="materials-heading">{t.materialsTitle1}<br /><em>{t.materialsTitle2}</em></h2>
              <p>{t.materialsSummary}</p>
            </div>
            <div className="material-features">
              <article className="material-feature">
                <div className="material-image"><img src="/images/loofah-macro.jpg" loading="lazy" alt={language === 'zh' ? '干燥丝瓜络纤维的近距离照片，展现自然交织、通透的网状结构。' : 'Close-up photograph of dried loofah fibers, showing their open, tangled natural structure.'} /><span className="material-image-code">M / 01</span></div>
                <div className="material-text"><div className="material-headline"><h3>{language === 'zh' ? '丝瓜络' : 'Loofah'} <em>/</em> {language === 'zh' ? 'Loofah' : '丝瓜络'}</h3><span>01</span></div><p>{t.loofahDescription}</p><p className="micro-label">{t.loofahTags}</p></div>
              </article>
              <article className="material-feature material-feature-offset">
                <div className="material-image"><img src="/images/corn-husk-macro.jpg" loading="lazy" alt={language === 'zh' ? '层叠玉米皮的近距离照片，展现纵向叶脉、自然褶皱与浅稻草色纹理。' : 'Close-up photograph of layered corn husks, showing their long veins, folds and straw-colored grain.'} /><span className="material-image-code">M / 02</span></div>
                <div className="material-text"><div className="material-headline"><h3>{language === 'zh' ? '玉米皮' : 'Corn husk'} <em>/</em> {language === 'zh' ? 'Corn husk' : '玉米皮'}</h3><span>02</span></div><p>{t.cornDescription}</p><p className="micro-label">{t.cornTags}</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="principles section-space" id="process" aria-labelledby="principles-heading">
          <div className="container principle-layout">
            <div className="principle-intro">
              <p className="eyebrow">{t.approachEyebrow}</p>
              <h2 id="principles-heading">{t.approachTitle1}<br /><em>{t.approachTitle2}</em></h2>
              <p>{t.approachIntro}</p>
              <div className="process-art"><img src="/images/process-worktable.jpg" loading="lazy" alt={language === 'zh' ? '阳光下的工作台上，创作者正在折叠玉米皮，旁边摆着丝瓜络纤维与纸样。' : 'A maker folds corn husk beside loofah fibers and paper patterns on a sunlit worktable.'} /><span>{t.processCaption}</span></div>
            </div>
            <ol className="principle-list">
              {t.approachSteps.map((step, index) => <li key={step.title}><span className="principle-num">0{index + 1} /</span><div><h3>{step.title}</h3><p>{step.body}</p></div><span className="principle-mark" aria-hidden="true">↗</span></li>)}
            </ol>
          </div>
        </section>

        <section className="story section-space" id="about" aria-labelledby="story-heading">
          <div className="container story-layout">
            <div className="story-side"><p className="eyebrow">{t.storyEyebrow}</p><div className="story-stitch" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><span>{t.storySideNote}</span></div>
            <div className="story-main">
              <h2 id="story-heading">{t.storyTitle1}<br />{t.storyTitle2}<br /><em>{t.storyTitle3}</em></h2>
              <div className="story-columns"><p>{t.storyParagraph1}</p><p>{t.storyParagraph2}</p></div>
              <span className="story-signoff">{t.storySignoff}</span>
            </div>
          </div>
        </section>

        <section className="newsletter section-space" id="newsletter" aria-labelledby="newsletter-heading">
          <div className="container newsletter-layout">
            <div><p className="eyebrow"><span className="blue-thread" aria-hidden="true"></span> {t.newsletterEyebrow}</p><h2 id="newsletter-heading">{t.newsletterTitle1}<br /><em>{t.newsletterTitle2}</em></h2><p>{t.newsletterDescription}</p></div>
            <div className="signup-panel">
              <p className="signup-label">{t.firstCollection}</p>
              <p className="signup-invitation">{t.collectionInvitation}</p>
              <a className="button button-glass" href="#collection"><span>{t.meetCollection}</span><Arrow /></a>
              <p className="signup-note"><span>01</span> {language === 'zh' ? '清洁' : 'Clean'} <i></i><span>02</span> {language === 'zh' ? '栽植' : 'Grow'} <i></i><span>03</span> {language === 'zh' ? '收纳' : 'Gather'}</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-top"><a className="footer-logo" href="#top">SOWN <span>&</span> SHAPED<span className="brand-dot">.</span></a><p>{t.heroBelief1}<br />{t.heroBelief2}</p></div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Sown & Shaped. {t.independentConcept}</span>
            <nav aria-label={language === 'zh' ? '页脚导航' : 'Footer navigation'}><a href="#collection">{t.footerCollection}</a><a href="#materials">{t.footerMaterials}</a><a href="#process">{t.footerApproach}</a><a href="#about">{t.footerStory}</a><a href="#top">{t.backToTop}</a></nav>
          </div>
        </div>
      </footer>
      {selectedProduct && <ProductDialog product={selectedProduct} language={language} onClose={closeProduct} onExplore={exploreFromDialog} />}
    </div>
  );
}

export default App;
