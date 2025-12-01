import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Privacy Policy</h1>
        <p className="text-gray-300 mb-6">Last updated: November 27, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">EventHub (the "Platform") is committed to protecting the privacy of our users. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your information when using the Platform.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">2. Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Personal information:</strong> details you provide when creating an account or registering for events, such as name, email address (SLIIT email), profile photo, contact phone, and organization/department.</li>
            <li><strong>Event registration data:</strong> event choices, attendance status, tickets or passes, and any answers to event-specific forms.</li>
            <li><strong>Usage information:</strong> pages visited, search queries, clicks, and other interactions collected through logs and analytics.</li>
            <li><strong>Device and technical data:</strong> IP address, browser type, operating system, device identifiers, and performance data.</li>
            <li><strong>Communications:</strong> messages you send to organizers or support and any responses we provide.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">3. How We Use Your Information</h2>
          <p className="text-gray-300 leading-relaxed">We use collected information for purposes including:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Providing and improving the Platform and its features.</li>
            <li>Processing event registrations and communicating with attendees and organizers.</li>
            <li>Personalizing content and recommendations.</li>
            <li>Monitoring and preventing fraud, abuse, and security incidents.</li>
            <li>Complying with legal obligations and safety requests.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">4. Cookies and Tracking</h2>
          <p className="text-gray-300 leading-relaxed">We use cookies and similar technologies to provide core functionality, remember preferences, and collect analytics. You can control cookies via your browser settings, but disabling certain cookies may affect the Platform experience.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">5. Third-Party Services</h2>
          <p className="text-gray-300 leading-relaxed">We may use third-party services (analytics, hosting, email delivery, maps) that collect or process data on our behalf. These providers have their own privacy policies and are contracted to protect your data in accordance with applicable law.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">6. Data Security</h2>
          <p className="text-gray-300 leading-relaxed">We implement reasonable technical and organizational measures to protect personal data. However, no method of transmission or storage is completely secure; if a breach occurs, we will follow applicable notification rules.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">7. Data Retention</h2>
          <p className="text-gray-300 leading-relaxed">We retain personal data as long as necessary to provide services, comply with legal obligations, or for legitimate business purposes such as fraud prevention and dispute resolution.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">8. Your Rights</h2>
          <p className="text-gray-300 leading-relaxed">Depending on your jurisdiction, you may have rights to access, correct, delete, or export your personal data. To exercise these rights, contact our support team (details below).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">9. Children</h2>
          <p className="text-gray-300 leading-relaxed">The Platform is intended for university students, staff, and authorized users. We do not knowingly collect personal information from children under 13. If you believe a child’s information has been collected, contact us to request removal.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">10. Changes to This Policy</h2>
          <p className="text-gray-300 leading-relaxed">We may update this policy from time to time. When changes are significant, we will provide a prominent notice on the Platform and update the "Last updated" date above.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-3">11. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">If you have questions or requests related to this Privacy Policy, please contact EventHub Support at <a href="mailto:support@eventhub.lk" className="text-yellow-400">support@eventhub.lk</a>.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
