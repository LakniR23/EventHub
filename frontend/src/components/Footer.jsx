import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const goTo = (path, state) => {
    try {
      if (state) navigate(path, { state });
      else navigate(path);
    } finally {
      // ensure we jump to top of the page after navigation
      // use a short timeout so navigation finishes and the new view can be scrolled
      setTimeout(() => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        } catch (e) {
          // fallback
          window.scrollTo(0, 0);
        }
      }, 50);
    }
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-blue-600 to-yellow-500"></div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <h3 className="text-3xl font-bold text-yellow-500">EventHub</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your gateway to campus events, competitions, and community engagement. Connect, participate, and create memorable experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87C3.44 4.78 4.69 4 5.94 4c1.26 0 2.03.78 2.06 1.89C8 6.93 7.17 7.76 5.47 7.76zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-yellow-500 mb-6 border-b border-yellow-500/30 pb-2">Quick Links</h4>
              <div className="space-y-3">
                <button onClick={() => goTo('/')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Home</button>
                <button onClick={() => goTo('/events')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Events</button>
                <button onClick={() => goTo('/clubs-and-societies')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Clubs &amp; Societies</button>
                <button onClick={() => goTo('/announcements')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Announcements</button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-yellow-500 mb-6 border-b border-yellow-500/30 pb-2">Services</h4>
              <div className="space-y-3">
                <button onClick={() => goTo('/career')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Career</button>
                <button onClick={() => goTo('/venues')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Venues</button>
                <button onClick={() => goTo('/help')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Help</button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-yellow-500 mb-6 border-b border-yellow-500/30 pb-2">Contact & Support</h4>
              <div className="space-y-3">
                <button onClick={() => goTo('/about')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">About Us</button>
                <button onClick={() => goTo('/help', { activeSection: 'contact' })} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Contact</button>
                <button onClick={() => goTo('/privacy')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Privacy Policy</button>
                <button onClick={() => goTo('/terms')} className="w-full text-left text-gray-300 hover:text-yellow-500 hover:pl-2 transition-all duration-300">Terms of Service</button>
              </div>
            </div>
          </div>

          

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 EventHub. All rights reserved. | Built with ❤️ for our campus community</div>
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 text-sm">Powered by</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-500 font-semibold text-sm">Campus Connect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
