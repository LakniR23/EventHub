import { useState, useEffect } from 'react';
import CustomAlert from '../../components/CustomAlert';
import ConfirmAlert from '../../components/ConfirmAlert';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import { useConfirmAlert } from '../../hooks/useConfirmAlert';
import registrationServices from '../../services/registrationServices';
import SearchInput from '../../components/SearchInput';

const RegistrationsTab = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [date, setDate] = useState('');
  const [filterBy, setFilterBy] = useState('ALL'); // ALL | EVENT | DATE

  const { alert, showSuccess, showError, hideAlert } = useCustomAlert();
  const { confirm, hideConfirm, confirmDelete } = useConfirmAlert();

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Health check to give a clearer error when backend isn't running
      try {
        const healthRes = await fetch('/api/health');
        if (!healthRes.ok) {
          throw new Error(`Health check failed: ${healthRes.status}`);
        }
      } catch (hErr) {
        console.warn('Backend health check failed:', hErr);
        setError('Backend not reachable at /api. Is the backend server running on port 5000?');
        return;
      }

      const data = await registrationServices.getRegistrations();
      setRegistrations(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Helpers to normalize and open/download receipts (handle data: URLs, raw base64, and normal URLs)
  const getReceiptHref = (receipt) => {
    if (!receipt || typeof receipt !== 'string') return null;
    const trimmed = receipt.trim();
    if (trimmed.startsWith('data:')) return trimmed;
    // looks like base64 without data: prefix
    const likelyBase64 = /^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 100;
    if (likelyBase64) return `data:application/pdf;base64,${trimmed}`;
    // try to validate as URL
    try {
      // eslint-disable-next-line no-new
      new URL(trimmed);
      return trimmed;
    } catch (e) {
      // fallback: assume base64 pdf
      return `data:application/pdf;base64,${trimmed}`;
    }
  };

  const openReceipt = (receipt) => {
    const href = getReceiptHref(receipt);
    if (!href) return;

    if (href.startsWith('data:')) {
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        // popup blocked - fallback to direct navigation
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
        return;
      }
      // write an iframe to the new window to reliably show data: PDFs
      newWindow.document.write(`<!doctype html><html><head><title>Receipt</title></head><body style="margin:0"><iframe src="${href}" frameborder="0" style="border:0;width:100%;height:100vh"></iframe></body></html>`);
      newWindow.document.close();
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const downloadReceipt = (receipt, id) => {
    const href = getReceiptHref(receipt);
    if (!href) return;
    if (href.startsWith('data:')) {
      const [meta, b64] = href.split(',');
      const mime = (meta.match(/data:([^;]+);/) || [])[1] || 'application/octet-stream';
      try {
        const byteChars = atob(b64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        // fallback: open in new tab
        openReceipt(href);
      }
    } else {
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = `receipt_${id}`;
      a.click();
    }
  };

  const handleDelete = (item) => {
    confirmDelete(item.name || item.email || `#${item.id}`, async () => {
      try {
        await registrationServices.deleteRegistration(item.id);
        setRegistrations(prev => prev.filter(r => r.id !== item.id));
        showSuccess('Deleted', 'Registration deleted successfully');
      } catch (err) {
        console.error('Error deleting registration:', err);
        showError('Error', 'Failed to delete registration');
      }
    });
  };

  const filtered = registrations.filter(r => {
    // Text search (name, email, event)
    if (query) {
      const q = query.toLowerCase();
      const name = (r.name || '').toLowerCase();
      const email = (r.email || '').toLowerCase();
      const title = (r.eventTitle || r.event?.title || '').toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !title.includes(q)) return false;
    }

    // Event filter (only when filterBy === 'EVENT')
    if (filterBy === 'EVENT' && selectedEvent && selectedEvent !== 'ALL') {
      const title = (r.eventTitle || r.event?.title || '').toString();
      if (title !== selectedEvent) return false;
    }

    // Single date filter (based on createdAt) (only when filterBy === 'DATE')
    if (filterBy === 'DATE' && date) {
      const created = r.createdAt ? new Date(r.createdAt) : null;
      if (!created) return false;
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);
      if (created < start || created > end) return false;
    }

    return true;
  });

  return (
    <div>
      <div className="border border-gray-700 rounded-lg p-4 mb-6 bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email or event"
              />
            </div>

            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
              <option value="ALL">Filter by</option>
              <option value="EVENT">Event</option>
              <option value="DATE">Date</option>
            </select>

            {filterBy === 'EVENT' && (
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200">
                <option value="ALL">All events</option>
                {Array.from(new Set(registrations.map(r => (r.eventTitle || r.event?.title || '').toString()).filter(Boolean))).map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            )}

            {filterBy === 'DATE' && (
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-sm text-gray-200" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span onClick={() => { setQuery(''); setSelectedEvent('ALL'); setDate(''); fetchRegistrations(); }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { setQuery(''); setSelectedEvent('ALL'); setDate(''); fetchRegistrations(); } }} className="text-sm text-gray-400 hover:text-yellow-400 cursor-pointer">Clear Filters</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden p-4">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-500">Loading registrations...</span>
            </div>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">
            <p className="font-medium">Failed to fetch registrations.</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-300">No registrations found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(r => (
              <div key={r.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-400">ID</div>
                    <div className="text-sm font-semibold text-white">{r.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Submitted</div>
                    <div className="text-sm text-gray-300">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-400">Event</div>
                  <div className="text-sm font-medium text-white truncate">{r.eventTitle || r.event?.title || '—'}</div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-1">
                  <div>
                    <div className="text-xs text-gray-400">Name</div>
                    <div className="text-sm font-medium text-white truncate">{r.name}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="text-sm text-gray-300 truncate">{r.email}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Phone</div>
                      <div className="text-sm text-gray-300 truncate">{r.phone || '—'}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400">Reg No</div>
                      <div className="text-sm text-gray-300 truncate">{r.registrationNumber || '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-300">{r.receipt ? (<span className="text-green-400">Receipt</span>) : '—'}</div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelected(r)} className="text-yellow-400 hover:text-yellow-300 text-sm">View</button>
                    <button onClick={() => handleDelete(r)} className="text-red-500 hover:text-red-400 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
          <div className="relative z-10 max-w-xl w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-start justify-between">
              <h4 className="text-2xl font-bold text-yellow-400">Registration Details</h4>
              <button onClick={() => setSelected(null)} aria-label="Close details" className="ml-4 inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l8 8M6 14L14 6"/></svg>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <div className="text-xs text-gray-400 mb-1">Event</div>
                <div className="text-white font-semibold">{selected.eventTitle || selected.event?.title || '—'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Submitted</div>
                <div className="text-white">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Name</div>
                <div className="text-white font-medium">{selected.name}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Registration No</div>
                <div className="text-white">{selected.registrationNumber || '—'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Email</div>
                <div className="text-white">{selected.email}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Phone</div>
                <div className="text-white">{selected.phone || '—'}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Confirmed Presence</div>
                <div className="inline-flex items-center px-2 py-1 rounded-md text-sm font-semibold" style={{backgroundColor: selected.confirmPresence ? 'rgba(34,197,94,0.08)' : 'rgba(209,213,219,0.06)'}}>
                  <span className={selected.confirmPresence ? 'text-green-400' : 'text-gray-300'}>{selected.confirmPresence ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-400 mb-1">Notes</div>
                  <div className="text-gray-300 whitespace-pre-wrap">{selected.notes}</div>
                </div>
              )}

              {selected.receipt && typeof selected.receipt === 'string' && (
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-400">Receipt</div>
                  <div className="flex items-center gap-4">
                    {(() => {
                      const href = getReceiptHref(selected.receipt);
                      if (!href) return <span className="text-gray-300">—</span>;
                      const isImage = href.startsWith('data:image') || /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i.test(href);
                      const isPdf = href.startsWith('data:application/pdf') || /\.pdf(\?|$)/i.test(href);
                      if (isImage) return <img src={href} alt="Receipt" className="max-h-40 rounded-md border border-gray-700" />;
                      if (isPdf) return <button type="button" onClick={() => openReceipt(selected.receipt)} className="text-yellow-400 underline hover:text-yellow-300">Open PDF receipt</button>;
                      return <button type="button" onClick={() => openReceipt(selected.receipt)} className="text-yellow-400 underline hover:text-yellow-300">Open receipt</button>;
                    })()}

                    <button type="button" onClick={() => downloadReceipt(selected.receipt, selected.id)} className="text-sm text-gray-300 hover:underline">Download</button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 hover:opacity-90">Close</button>
            </div>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      <ConfirmAlert
        isOpen={confirm.isOpen}
        onClose={hideConfirm}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        type={confirm.type}
      />
    </div>
  );
};

export default RegistrationsTab;
