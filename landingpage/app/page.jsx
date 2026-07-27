import ScrollReveal from '../components/ScrollReveal';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import WhyUs from '../components/WhyUs';
import ServiceBlock from '../components/ServiceBlock';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import { services } from '../lib/data';

export default function LandingPage() {
  return (
    <>
      <ScrollReveal />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <WhyUs />

        {/* Two services — Landing Pages first (campaign focus), then Websites */}
        <div id="services">
          {services.map((service, i) => (
            <ServiceBlock key={service.id} service={service} index={i} />
          ))}
        </div>

        <Process />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
