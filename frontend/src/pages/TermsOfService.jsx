import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-bold text-yellow-500">EventHub</h1>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => navigate('/')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">Home</button>
                <button onClick={() => navigate('/events')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">Events</button>
                <button onClick={() => navigate('/clubs-and-societies')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">Clubs &amp; Societies</button>
                <button onClick={() => navigate('/career')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">Career</button>
                <button onClick={() => navigate('/about')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">About</button>
                <button onClick={() => navigate('/help')} className="text-yellow-500 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Terms of Service</h1>
        <p className="text-gray-300 mb-6">Last updated: November 27, 2025</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-300">By accessing or using EventHub (the "Platform"), you agree to be bound by these Terms of Service and any additional terms that apply to specific features. If you do not agree, do not use the Platform.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">2. Eligibility</h2>
          <p className="text-gray-300">You must be at least the minimum age required by applicable law and have authority to enter into these Terms. The Platform is intended primarily for university students, faculty, and staff.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">3. Accounts and Access</h2>
          <p className="text-gray-300">You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorized account use.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">4. User Conduct</h2>
          <p className="text-gray-300">Users must not use the Platform for unlawful activities, harassment, or content that infringes third-party rights. You agree to follow event-specific rules and organizer instructions.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">5. Event Registration, Payments & Refunds</h2>
          <p className="text-gray-300">Registration terms (including fees) are set by event organizers. Payments may be processed by third-party providers; refund policies vary by event and organizer. Check event details for specific refund terms.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">6. Intellectual Property</h2>
          <p className="text-gray-300">The Platform and its content (text, graphics, logos) are owned or licensed by EventHub. You may not reproduce or distribute proprietary content without permission.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">7. Disclaimers and Limitations</h2>
          <p className="text-gray-300">The Platform is provided "as is" without warranties. To the fullest extent permitted by law, EventHub disclaims all warranties and is not liable for indirect, incidental, or consequential damages.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">8. Termination</h2>
          <p className="text-gray-300">We may suspend or terminate accounts for violations of these Terms or for other legitimate reasons. Upon termination, some information may be retained as required by law.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">9. Governing Law</h2>
          <p className="text-gray-300">These Terms are governed by the laws of the jurisdiction in which the University operates, without regard to conflict of law principles.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">10. Changes to Terms</h2>
          <p className="text-gray-300">We may update these Terms from time to time. We will provide notice for significant changes and update the "Last updated" date above.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-2">11. Contact</h2>
          <p className="text-gray-300">For questions about these Terms, contact EventHub Support at <a href="mailto:support@eventhub.lk" className="text-yellow-400">support@eventhub.lk</a>.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
