import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BedDouble, CalendarDays, ExternalLink, Mail, MapPin, Menu, MessageCircle, Phone, Ruler, Search, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type Property = {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  status: string;
  price: string;
  priceLabel: string;
  currency: 'PKR' | 'AED';
  priceValue: number;
  beds: string;
  baths: string;
  area: string;
  description: string;
  image: string;
  gallery: string[];
  features: string[];
  consultant: string;
};

const properties: Property[] = [
  {
    id: 'clifton-house',
    name: 'The Clifton House',
    location: 'Clifton Block 4, Karachi',
    city: 'Karachi',
    type: 'House',
    status: 'For Sale',
    price: 'PKR 148M',
    priceLabel: 'PKR 14.8 Crore',
    currency: 'PKR',
    priceValue: 14.8,
    beds: '5 beds',
    baths: '6 baths',
    area: '4,200 sq ft',
    description: 'A quietly generous family home with double-height living spaces, filtered daylight and a garden that feels removed from the city.',
    image: 'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=1600',
    gallery: [
      'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.pexels.com/photos/7031616/pexels-photo-7031616.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7031609/pexels-photo-7031609.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    features: ['Double-height drawing room', 'Private garden court', 'Imported kitchen finishes', 'Staff accommodation', 'Secure two-car garage', 'Near Clifton beach'],
    consultant: 'Areeba Khan',
  },
  {
    id: 'dha-lahore-apartment',
    name: 'DHA Phase V Residence',
    location: 'DHA Phase V, Lahore',
    city: 'Lahore',
    type: 'Apartment',
    status: 'For Sale',
    price: 'PKR 67.5M',
    priceLabel: 'PKR 6.75 Crore',
    currency: 'PKR',
    priceValue: 6.75,
    beds: '3 beds',
    baths: '3 baths',
    area: '2,150 sq ft',
    description: 'A composed, light-filled apartment with broad city views and a calm material palette in Lahore’s most connected district.',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1500',
    gallery: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1500',
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    features: ['Panoramic city views', 'Resident gym and pool', 'Sunlit open kitchen', 'Dedicated study', 'Valet lobby', 'Two reserved parking bays'],
    consultant: 'Hassan Raza',
  },
  {
    id: 'e-11-islamabad',
    name: 'E-11 Garden Apartment',
    location: 'E-11/2, Islamabad',
    city: 'Islamabad',
    type: 'Apartment',
    status: 'For Rent',
    price: 'PKR 285K',
    priceLabel: 'PKR 285,000 / month',
    currency: 'PKR',
    priceValue: 0.0285,
    beds: '3 beds',
    baths: '3 baths',
    area: '2,000 sq ft',
    description: 'A generous rental for a considered move to Islamabad, with mature trees at the edge of every room and a concierge-led arrival.',
    image: 'https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1500',
    gallery: [
      'https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1500',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    features: ['Margalla-facing balcony', 'Fully furnished', 'Backup power', 'Concierge service', 'Pet-considered', 'Ten minutes to F-7'],
    consultant: 'Zainab Siddiqui',
  },
  {
    id: 'dubai-harbour',
    name: 'Harbour Light, Dubai',
    location: 'Dubai Harbour, Dubai',
    city: 'Dubai',
    type: 'Apartment',
    status: 'For Sale',
    price: 'AED 3.8M',
    priceLabel: 'AED 3.8 million',
    currency: 'AED',
    priceValue: 3.8,
    beds: '2 beds',
    baths: '2 baths',
    area: '1,340 sq ft',
    description: 'An elevated waterfront address for a life between cities: warm oak, horizon light and the marina just below.',
    image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1500',
    gallery: [
      'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1500',
      'https://images.pexels.com/photos/7031412/pexels-photo-7031412.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7031415/pexels-photo-7031415.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    features: ['Full marina outlook', 'Private residents lounge', 'Designer kitchen', 'Infinity pool deck', 'Smart-home ready', 'Minutes to the beach'],
    consultant: 'Areeba Khan',
  },
];

const contactPhone = '+92 300 1234567';
const contactEmail = 'hello@estatehaus.com';
const whatsapp = '923001234567';
const heroImage = 'https://images.pexels.com/photos/7031603/pexels-photo-7031603.jpeg?auto=compress&cs=tinysrgb&w=2200';

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', window.location.href, true);
    setMeta('og:image', heroImage, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:image', heroImage);
  }, [title, description]);
}

function Header({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`topbar ${light ? 'detail-nav' : ''} ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container-wide nav-inner">
        <Link href="/" className="brand" aria-label="EstateHaus home" data-testid="link-brand">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-name">EstateHaus</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#home" data-testid="link-nav-home">Home</a>
          <a href="/#properties" data-testid="link-nav-properties">Properties</a>
          <a href="/#approach" data-testid="link-nav-approach">About</a>
          <a href="/#services" data-testid="link-nav-services">Services</a>
          <a href="/#contact" data-testid="link-nav-contact">Contact</a>
        </nav>
        <a className="button button-gold nav-consultation" href="/#contact" data-testid="button-nav-consultation">Book a Consultation <ArrowRight size={14} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} data-testid="button-mobile-menu">
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="/#home" onClick={closeMenu} data-testid="link-mobile-home">Home</a>
        <a href="/#properties" onClick={closeMenu} data-testid="link-mobile-properties">Properties</a>
        <a href="/#approach" onClick={closeMenu} data-testid="link-mobile-approach">About</a>
        <a href="/#services" onClick={closeMenu} data-testid="link-mobile-services">Services</a>
        <a href="/#contact" onClick={closeMenu} data-testid="link-mobile-contact">Contact</a>
        <button className="button button-gold button-block" type="button" onClick={() => { closeMenu(); setLocation('/#contact'); }} data-testid="button-mobile-inquiry">Book a Consultation</button>
      </div>
    </header>
  );
}

type SearchValues = { location: string; type: string; price: string; intent: string };

function SearchPanel({ onSearch }: { onSearch: (values: SearchValues) => void }) {
  const [values, setValues] = useState<SearchValues>({ location: 'Any location', type: 'Any type', price: 'Any price', intent: 'Buy or rent' });
  return (
    <form className="search-panel" onSubmit={(event) => { event.preventDefault(); onSearch(values); }} aria-label="Property search">
      <div className="search-field">
        <label htmlFor="search-location">Location</label>
        <select id="search-location" value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} data-testid="select-search-location">
          <option>Any location</option><option>Karachi</option><option>Lahore</option><option>Islamabad</option><option>Dubai</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-type">Property type</label>
        <select id="search-type" value={values.type} onChange={(event) => setValues({ ...values, type: event.target.value })} data-testid="select-search-type">
          <option>Any type</option><option>House</option><option>Apartment</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-intent">I am looking to</label>
        <select id="search-intent" value={values.intent} onChange={(event) => setValues({ ...values, intent: event.target.value })} data-testid="select-search-intent">
          <option>Buy or rent</option><option>Buy</option><option>Rent</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-price">Price range</label>
        <select id="search-price" value={values.price} onChange={(event) => setValues({ ...values, price: event.target.value })} data-testid="select-search-price">
          <option>Any price</option><option>PKR · up to 8 crore</option><option>PKR · 8–15 crore</option><option>AED · up to 3M</option><option>AED · 3M+</option>
        </select>
      </div>
      <button className="button button-gold" type="submit" data-testid="button-search"><Search size={16} /> Find a property</button>
    </form>
  );
}

function PropertyCard({ property, featured = false }: { property: Property; featured?: boolean }) {
  return (
    <article className={`property-card ${featured ? 'featured-card' : ''}`} data-testid={`card-property-${property.id}`}>
      <Link href={`/property/${property.id}`} aria-label={`View ${property.name}`} data-testid={`link-property-${property.id}`}>
        <div className="property-image-wrap">
          <img className="property-image" src={property.image} alt={`${property.name} in ${property.location}`} />
          <span className="property-tag">{property.status}</span>
        </div>
      </Link>
      <div className="property-body">
        <div className="property-location">{property.city} · {property.type}</div>
        <h3 className="property-name"><Link href={`/property/${property.id}`} data-testid={`link-property-title-${property.id}`}>{property.name}</Link></h3>
        <p className="property-description">{property.description}</p>
        <div className="property-meta">
          <span><BedDouble size={14} /> {property.beds}</span><span><Ruler size={14} /> {property.area}</span>
        </div>
        <div className="property-price"><span>{property.price}</span><Link href={`/property/${property.id}`} data-testid={`link-view-details-${property.id}`}>View details <ArrowRight size={13} /></Link></div>
      </div>
    </article>
  );
}

type ContactFormValues = { name: string; email: string; phone: string; interest: string; message: string };

function InquiryForm({ propertyName }: { propertyName?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({ defaultValues: { interest: propertyName ? 'Schedule a viewing' : 'Buying a property' } });
  const onSubmit = (data: ContactFormValues) => { setSubmitted(true); reset({ ...data, message: '' }); };
  return (
    <form className="inquiry-form" onSubmit={handleSubmit(onSubmit)} noValidate data-testid="form-inquiry">
      {submitted && <div className="success-message" role="status" data-testid="status-inquiry-success"><strong>Thank you — your inquiry is noted.</strong> This is a demo form; for a real conversation, email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or WhatsApp us below.</div>}
      <div className="form-field">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" {...register('name', { required: 'Please share your name.' })} placeholder="e.g. Sana Ahmed" data-testid="input-contact-name" />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" type="email" {...register('email', { required: 'Please add your email.', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please check this email.' } })} placeholder="you@example.com" data-testid="input-contact-email" />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="contact-phone">Phone / WhatsApp</label>
        <input id="contact-phone" {...register('phone', { required: 'Please add a number.' })} placeholder="+92 300 000 0000" data-testid="input-contact-phone" />
        {errors.phone && <span className="field-error">{errors.phone.message}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="contact-interest">I’m interested in</label>
        <select id="contact-interest" {...register('interest')} data-testid="select-contact-interest">
          <option>Buying a property</option><option>Selling a property</option><option>Renting a property</option><option>Property investment</option><option>Overseas Pakistanis advisory</option><option>Schedule a viewing</option>
        </select>
      </div>
      <div className="form-field full">
        <label htmlFor="contact-message">A little more context</label>
        <textarea id="contact-message" {...register('message')} placeholder={propertyName ? `I’d like to know more about ${propertyName}...` : 'Tell us what a good outcome looks like...'} data-testid="textarea-contact-message" />
      </div>
      <div className="form-foot">
        <small>Demo contact details and sample listings only. No information is sent to a live brokerage.</small>
        <button className="button button-primary" type="submit" data-testid="button-submit-inquiry">Send inquiry <ArrowRight size={15} /></button>
      </div>
    </form>
  );
}

function Home() {
  usePageMeta('EstateHaus — Find a Place Worth Calling Home.', 'Discover exceptional properties selected for modern living, investment and long-term value across Pakistan and Dubai.');
  const [filters, setFilters] = useState<SearchValues>({ location: 'Any location', type: 'Any type', price: 'Any price', intent: 'Buy or rent' });
  const filteredProperties = useMemo(() => properties.filter((property) => {
    const locationMatch = filters.location === 'Any location' || property.city === filters.location;
    const typeMatch = filters.type === 'Any type' || property.type === filters.type;
    const priceMatch = filters.price === 'Any price'
      || (filters.price === 'PKR · up to 8 crore' && property.currency === 'PKR' && property.priceValue <= 8)
      || (filters.price === 'PKR · 8–15 crore' && property.currency === 'PKR' && property.priceValue > 8 && property.priceValue <= 15)
      || (filters.price === 'AED · up to 3M' && property.currency === 'AED' && property.priceValue <= 3)
      || (filters.price === 'AED · 3M+' && property.currency === 'AED' && property.priceValue > 3);
    const intentMatch = filters.intent === 'Buy or rent' || (filters.intent === 'Buy' && property.status === 'For Sale') || (filters.intent === 'Rent' && property.status === 'For Rent');
    return locationMatch && typeMatch && priceMatch && intentMatch;
  }), [filters]);
  const runSearch = (values: SearchValues) => {
    setFilters(values);
    window.setTimeout(() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
  };
  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img className="hero-image" src={heroImage} alt="" aria-hidden="true" />
          <div className="container-wide hero-content">
            <div className="hero-kicker reveal">EstateHaus real estate advisory</div>
            <h1 id="hero-title" className="display hero-title reveal reveal-delay-1">Find a Place<br />Worth Calling <em>Home.</em></h1>
            <p className="hero-subtitle reveal reveal-delay-2">Discover exceptional properties selected for modern living, investment and long-term value.</p>
            <div className="hero-actions reveal reveal-delay-2"><a className="button button-gold" href="#properties" data-testid="button-hero-explore">Explore Properties <ArrowRight size={15} /></a><a className="button button-outline" href="#contact" data-testid="button-hero-consultation">Book a Consultation</a></div>
            <div className="reveal reveal-delay-3"><SearchPanel onSearch={runSearch} /></div>
          </div>
        </section>
        <section className="trust-strip" aria-label="EstateHaus sample metrics">
          <div className="container-wide trust-inner">
            <div className="trust-metric"><span className="metric-value">250+</span><span className="metric-label" data-testid="text-metric-properties">Properties Listed</span></div>
            <div className="trust-metric"><span className="metric-value">120+</span><span className="metric-label" data-testid="text-metric-deals">Successful Deals</span></div>
            <div className="trust-metric"><span className="metric-value">8+</span><span className="metric-label" data-testid="text-metric-experience">Years Experience</span></div>
            <div className="trust-metric"><span className="metric-value">15+</span><span className="metric-label" data-testid="text-metric-areas">Areas Covered</span></div>
          </div>
        </section>
        <section className="section" id="properties" aria-labelledby="properties-title">
          <div className="container-wide">
            <div className="section-head">
              <div><div className="eyebrow">Featured properties · sample inventory</div><h2 id="properties-title" className="display section-heading">Properties<br /><i>Worth Seeing.</i></h2></div>
              <div><p className="section-copy">Explore a curated selection of exceptional properties chosen for modern living, investment and long-term value.</p><a className="link-arrow" href="#contact" data-testid="link-properties-contact">Tell us what you’re looking for <ArrowRight size={15} /></a></div>
            </div>
            <div className="listing-grid" data-testid="list-featured-properties">
              {filteredProperties.length ? filteredProperties.map((property, index) => <PropertyCard key={property.id} property={property} featured={index === 0} />) : <div className="no-results" data-testid="status-no-properties">No sample properties match those filters. <button className="button button-outline" type="button" onClick={() => setFilters({ location: 'Any location', type: 'Any type', price: 'Any price', intent: 'Buy or rent' })} data-testid="button-clear-search">Reset the search</button></div>}
            </div>
          </div>
        </section>
        <section className="section split-section" id="approach" aria-labelledby="approach-title">
          <div className="container-wide split-grid">
            <div className="editorial-art">
              <img className="editorial-art-main" src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="A sunlit, quiet living room" />
              <img className="editorial-art-small" src="https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Warm modern interior detail" />
              <span className="art-caption">A different kind of property advice</span>
            </div>
            <div>
              <div className="eyebrow">Why choose us</div>
              <h2 id="approach-title" className="display section-heading">Real Estate, With<br /><i>a More Personal Approach.</i></h2>
              <p className="section-copy">The best decisions are rarely made under pressure. We bring local context, honest numbers and a steady hand to the move you have been thinking about.</p>
              <div className="benefit-list">
                <div className="benefit"><span className="benefit-number">01</span><div><h3>Local, lived-in knowledge</h3><p>We know the morning light, the commute and the questions that don’t make it into a listing.</p></div></div>
                <div className="benefit"><span className="benefit-number">02</span><div><h3>Fewer, better options</h3><p>A clear shortlist beats a catalogue. We filter for fit before we bring a home to you.</p></div></div>
                <div className="benefit"><span className="benefit-number">03</span><div><h3>Advice that travels</h3><p>For overseas Pakistanis, a trusted local perspective makes every decision feel closer.</p></div></div>
                <div className="benefit"><span className="benefit-number">04</span><div><h3>Clarity at every step</h3><p>From first call to keys, we explain the detail and keep momentum without the drama.</p></div></div>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="services" aria-labelledby="services-title">
          <div className="container-wide">
            <div className="section-head"><div><div className="eyebrow">Our services</div><h2 id="services-title" className="display section-heading">How We<br /><i>Can Help.</i></h2></div><p className="section-copy">Whether it is a first home, a long-distance investment or a sale that deserves care, our role stays simple: make the next decision clearer.</p></div>
            <div className="services-grid">
              <div className="service"><span className="service-index">01 / BUY</span><h3>Buy</h3><p>Shortlists shaped around how you want to live, with the detail to make a confident call.</p></div>
              <div className="service"><span className="service-index">02 / SELL</span><h3>Sell</h3><p>Thoughtful positioning, honest pricing and a process that protects the value of your time.</p></div>
              <div className="service"><span className="service-index">03 / RENT</span><h3>Rent</h3><p>Well-matched rentals and practical guidance for a move that should feel straightforward.</p></div>
              <div className="service"><span className="service-index">04 / INVEST</span><h3>Property Investment</h3><p>Local perspective and practical due diligence for decisions that need to travel well.</p></div>
            </div>
          </div>
        </section>
        <section className="section areas" id="areas" aria-labelledby="areas-title">
          <div className="container-wide">
            <div className="section-head"><div><div className="eyebrow">A sense of place</div><h2 id="areas-title" className="display section-heading">Explore Prime<br /><i>Locations.</i></h2></div><p className="section-copy muted">From the sea air of Clifton to Dubai Harbour’s horizon, our sample portfolio follows places with a distinct rhythm.</p></div>
            <div className="area-grid">
              {[
                ['Karachi', 'DHA · Clifton · Bahria Town', 'https://images.pexels.com/photos/3889855/pexels-photo-3889855.jpeg?auto=compress&cs=tinysrgb&w=1300'],
                ['Lahore', 'DHA · Gulberg · Bahria Town', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=900'],
                ['Islamabad', 'DHA · F-6 · F-7', 'https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&w=900'],
                ['Dubai', 'Downtown · Dubai Marina · Palm Jumeirah', 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=900'],
              ].map(([name, note, image]) => <div className="area" key={name}><img src={image} alt={`${name} area`} /><div className="area-content"><h3 className="area-name">{name}</h3><span className="area-note">{note}</span></div></div>)}
            </div>
          </div>
        </section>
        <section className="section process" id="process" aria-labelledby="process-title">
          <div className="container-wide">
            <div className="section-head"><div><div className="eyebrow">A calmer process</div><h2 id="process-title" className="display section-heading">A Simpler Way to<br /><i>Find Your Property.</i></h2></div><p className="section-copy">No mystery, no disappearing act. Just a clear four-part process shaped around your pace.</p></div>
            <div className="process-grid">
              <div className="process-step"><div className="process-dot">01</div><div><h3>Tell Us What You Need</h3><p>We start with the life behind the search — not just a bedroom count and a budget.</p></div></div>
              <div className="process-step"><div className="process-dot">02</div><div><h3>Explore Your Options</h3><p>Local insight and clear filters turn a wide market into a few right-fit choices.</p></div></div>
              <div className="process-step"><div className="process-dot">03</div><div><h3>View Your Favorites</h3><p>Viewings, comparisons and numbers presented in plain language, without the rush.</p></div></div>
              <div className="process-step"><div className="process-dot">04</div><div><h3>Move Forward Confidently</h3><p>We stay close through the detail so the final decision feels like yours.</p></div></div>
            </div>
          </div>
        </section>
        <section className="quote-section" aria-labelledby="quote-title">
          <div className="container-wide">
            <div className="section-head"><div><div className="eyebrow">Client perspective</div><h2 id="quote-title" className="display section-heading">What Our<br /><i>Clients Say.</i></h2></div><p className="section-copy">These fictional testimonials illustrate the kind of considered experience EstateHaus is designed to offer.</p></div>
            <div className="testimonial-grid">
              <article className="testimonial-card"><div className="quote-mark" aria-hidden="true">“</div><p>EstateHaus understood that we were not simply looking for more space. They found us a home that fit the life we were building.</p><strong>— Sample client, Karachi</strong><span>Fictional testimonial · demo content</span></article>
              <article className="testimonial-card"><div className="quote-mark" aria-hidden="true">“</div><p>From London, the process felt unusually close. Every question had a clear answer and every option had a reason behind it.</p><strong>— Sample client, overseas Pakistanis advisory</strong><span>Fictional testimonial · demo content</span></article>
              <article className="testimonial-card"><div className="quote-mark" aria-hidden="true">“</div><p>The shortlist was small, thoughtful and exactly where we should have been looking. That made the decision feel calm.</p><strong>— Sample client, Dubai</strong><span>Fictional testimonial · demo content</span></article>
            </div>
          </div>
        </section>
        <section className="cta-band" aria-labelledby="cta-title">
          <div className="container-wide cta-band-inner"><div><div className="eyebrow">A good place to begin</div><h2 id="cta-title" className="display">Your Next Property Could Be<br /><i>Closer Than You Think.</i></h2></div><div><p className="section-copy">Start with a conversation. No obligation, no prepared pitch — just a useful first step.</p><a className="button button-primary" href="#contact" data-testid="button-cta-contact">Book a Consultation <ArrowRight size={16} /></a></div></div>
        </section>
        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="container-wide contact-grid">
            <div><div className="eyebrow">Let’s talk</div><h2 id="contact-title" className="display section-heading">Let's Find<br /><i>Your Next Property.</i></h2><p className="section-copy">Share a little about the move ahead. We’ll come back with a thoughtful next step, usually within one working day.</p><div className="contact-details"><a className="contact-detail" href={`mailto:${contactEmail}`} data-testid="link-contact-email"><Mail size={18} /><div><span>Demo email address</span><strong>{contactEmail}</strong></div></a><a className="contact-detail" href={`tel:${contactPhone.replace(/\s/g, '')}`} data-testid="link-contact-phone"><Phone size={18} /><div><span>Demo phone / WhatsApp</span><strong>{contactPhone}</strong></div></a><div className="contact-detail"><MapPin size={18} /><div><span>By appointment · demo</span><strong>Karachi · Lahore · Islamabad · Dubai</strong></div></div></div></div>
            <InquiryForm />
          </div>
        </section>
      </main>
      <Footer />
      <div className="mobile-contact-bar"><a href={`tel:${contactPhone.replace(/\s/g, '')}`} data-testid="link-sticky-call"><Phone size={16} /> Call EstateHaus</a><a href={`https://wa.me/${whatsapp}?text=Hello%20EstateHaus%20—%20I%27d%20like%20to%20talk%20about%20a%20property.`} target="_blank" rel="noreferrer" data-testid="link-sticky-whatsapp"><MessageCircle size={16} /> WhatsApp</a></div>
    </div>
  );
}

function DetailPage() {
  const params = useParams<{ id: string }>();
  const property = properties.find((item) => item.id === params.id);
  usePageMeta(property ? `${property.name} — EstateHaus` : 'Property not found — EstateHaus', property ? `${property.name}, a sample property in ${property.location}. Explore facts and request a viewing with EstateHaus.` : 'This sample property is not available.');
  const [activeImage, setActiveImage] = useState(0);
  const [scheduleSent, setScheduleSent] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; date: string }>({ defaultValues: { name: '', date: '' } });
  if (!property) return <NotFound />;
  const onSchedule = () => { setScheduleSent(true); reset(); };
  return (
    <div className="detail-page">
      <Header light />
      <main className="detail-main">
        <div className="container-wide">
          <Link href="/#properties" className="back-link" data-testid="link-back-properties"><ArrowLeft size={14} /> Back to sample properties</Link>
          <div className="detail-heading">
            <div><div className="eyebrow">{property.status} · {property.type}</div><h1 className="display" data-testid={`text-property-name-${property.id}`}>{property.name}</h1><div className="detail-location"><MapPin size={14} /> {property.location}</div></div>
            <div className="detail-price" data-testid={`text-property-price-${property.id}`}>{property.priceLabel}</div>
          </div>
          <div className="gallery" data-testid={`gallery-property-${property.id}`}>
            {property.gallery.map((image, index) => <button className={index === 0 ? 'gallery-main' : ''} key={image} type="button" onClick={() => setActiveImage(index)} aria-label={`View gallery image ${index + 1}`} data-testid={`button-gallery-${property.id}-${index}`}><img src={image} alt={`${property.name}, view ${index + 1}`} style={{ opacity: activeImage === index ? 1 : .78 }} /></button>)}
          </div>
          <div className="detail-columns">
            <div>
              <h2 className="detail-section-title">A closer look</h2><p className="detail-description">{property.description} This is curated fictional inventory for the EstateHaus demo, created to show how a more considered property experience can feel.</p>
              <div className="facts-grid"><div className="fact"><span className="fact-label">Bedrooms</span><span className="fact-value" data-testid={`text-beds-${property.id}`}>{property.beds}</span></div><div className="fact"><span className="fact-label">Bathrooms</span><span className="fact-value">{property.baths}</span></div><div className="fact"><span className="fact-label">Area</span><span className="fact-value">{property.area}</span></div></div>
              <h2 className="detail-section-title">Details that matter</h2><ul className="feature-list">{property.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <div className="detail-disclaimer">This listing is fictional sample inventory for presentation purposes only. Price, availability, specifications and location details are not verified or indicative of a live brokerage relationship.</div>
            </div>
            <aside className="consult-card">
              <h3>Make it personal.</h3><p>Have a question about this sample property or looking for something with a similar feeling? Talk to a consultant.</p>
              <div className="consult-person"><div className="consult-avatar">{property.consultant.split(' ').map((name) => name[0]).join('')}</div><div><strong>{property.consultant}</strong><span>EstateHaus consultant · demo</span></div></div>
              <div className="consult-actions"><a className="button button-gold button-block" href={`https://wa.me/${whatsapp}?text=Hello%20EstateHaus%20—%20I%27m%20interested%20in%20${encodeURIComponent(property.name)}.`} target="_blank" rel="noreferrer" data-testid={`link-whatsapp-${property.id}`}><MessageCircle size={15} /> WhatsApp consultant</a><a className="button button-outline button-block" href={`mailto:${contactEmail}?subject=Question about ${property.name}`} data-testid={`link-email-${property.id}`}><Mail size={15} /> Email a question</a></div>
              <form className="schedule-form" onSubmit={handleSubmit(onSchedule)}><label className="eyebrow" htmlFor="schedule-name">Schedule a viewing</label>{scheduleSent && <div className="schedule-success" role="status" data-testid="status-schedule-success">Request noted for this demo. Email us to continue the conversation.</div>}<input id="schedule-name" {...register('name', { required: true })} placeholder="Your name" aria-label="Your name" required data-testid="input-schedule-name" /><input id="schedule-date" type="date" {...register('date', { required: true })} aria-label="Preferred date" required data-testid="input-schedule-date" /><button className="button button-primary button-block" type="submit" data-testid={`button-schedule-${property.id}`}><CalendarDays size={15} /> Request a viewing</button></form>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <div className="mobile-contact-bar"><a href={`tel:${contactPhone.replace(/\s/g, '')}`} data-testid="link-detail-sticky-call"><Phone size={16} /> Call EstateHaus</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" data-testid="link-detail-sticky-whatsapp"><MessageCircle size={16} /> WhatsApp</a></div>
    </div>
  );
}

function Footer() {
  return <footer className="footer"><div className="container-wide footer-grid"><div><Link href="/" className="brand" data-testid="link-footer-brand"><span className="brand-mark" aria-hidden="true"><span /></span><span className="brand-name">EstateHaus</span></Link><p className="footer-about">A premium real-estate advisory for the places, moves and decisions that matter.</p></div><div><h4>Company</h4><div className="footer-links"><a href="/#approach" data-testid="link-footer-about">About EstateHaus</a><a href="/#services" data-testid="link-footer-services">Services</a><a href="/#contact" data-testid="link-footer-contact">Contact</a></div></div><div><h4>Properties</h4><div className="footer-links"><a href="/#properties" data-testid="link-footer-properties">Featured properties</a><a href="/#areas" data-testid="link-footer-areas">Prime locations</a><a href="/#process" data-testid="link-footer-process">How it works</a></div></div><div><h4>Social</h4><div className="footer-links"><a href={`mailto:${contactEmail}`} data-testid="link-footer-email">{contactEmail}</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp">WhatsApp us <ExternalLink size={12} /></a><span className="demo-note">Demo contact details</span></div></div></div><div className="container-wide footer-bottom"><span>© 2026 EstateHaus. Presentation demo.</span><span className="demo-note">Sample inventory · sample metrics · fictional testimonials</span></div></footer>;
}

function NotFound() {
  usePageMeta('Page not found — EstateHaus', 'The requested EstateHaus sample page could not be found.');
  return <div className="not-found"><div><div className="eyebrow">404 · Not found</div><h1 className="display section-heading">This place is<br /><i>not on the map.</i></h1><p className="muted">The sample property or page you’re looking for has moved on.</p><Link className="button button-primary" href="/" data-testid="link-not-found-home">Return home <ArrowRight size={15} /></Link></div></div>;
}

const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/property/:id" component={DetailPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;