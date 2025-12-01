import { useEffect } from 'react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  title = 'Alert',
  message = '',
  type = 'info', // 'success', 'error', 'warning', 'info'
  showIcon = true,
  confirmText = 'OK',
  showConfirm = true
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-900 mb-4">
            <svg className="h-6 w-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-900 mb-4">
            <svg className="h-6 w-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400';
      case 'info':
      default:
        return 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-300 scale-100 border border-gray-700">
        <div className="p-6 text-center">
          {showIcon && getIcon()}

          <h3 className="text-lg font-semibold text-white mb-3">
            {title}
          </h3>

          {message && (
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              {message}
            </p>
          )}

          {showConfirm && (
            <button
              onClick={onClose}
              className={`w-full px-6 py-3 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;