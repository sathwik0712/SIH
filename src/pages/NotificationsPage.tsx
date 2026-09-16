import React, { useState } from 'react';
import { Mail, MessageSquare, Megaphone, IndianRupee, Inbox, Clock, CheckCircle2, Search } from 'lucide-react';

interface AppNotification {
  id: string;
  type: 'SMS' | 'EMAIL' | 'GAZETTE' | 'PFMS';
  title: string;
  recipient: string;
  timestamp: string;
  status: 'DELIVERED' | 'FAILED' | 'PENDING' | 'PUBLISHED';
  content: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'NTF-101', type: 'PFMS', title: 'PFMS Batch Transfer Successful', recipient: '2 Beneficiaries (Survey 14/2A, 14/2B)', timestamp: 'Today, 10:45 AM', status: 'DELIVERED', content: 'DBT transfer of ₹41.0L successfully processed. UTRs generated.', read: false },
  { id: 'NTF-102', type: 'SMS', title: 'Sec 23 Award Hearing Notice', recipient: 'Govind Shinde (+91 76543 21098)', timestamp: 'Yesterday, 04:30 PM', status: 'DELIVERED', content: 'Dear Landowner, your Award inquiry under Sec 23 is scheduled for 25-Jun-2025 at Collector Office. Pls attend.', read: true },
  { id: 'NTF-103', type: 'GAZETTE', title: 'Sec 11 Preliminary Notification Published', recipient: 'Public Domain / All Stakeholders', timestamp: '15 Mar 2025', status: 'PUBLISHED', content: 'Gazette No. MH/2025/0342 published for 8 parcels in Bhosari/Chikhali/Moshi.', read: true },
  { id: 'NTF-104', type: 'SMS', title: 'Joint Measurement Rescheduled', recipient: 'Lata Kulkarni (+91 65432 10987)', timestamp: '14 Jan 2025', status: 'FAILED', content: 'Joint measurement for 16/3 rescheduled to 15-Jan. Pls be present.', read: true },
  { id: 'NTF-105', type: 'EMAIL', title: 'Objection Received - Sec 15', recipient: 'Collector Office (admin@collector.gov)', timestamp: '10 May 2025', status: 'DELIVERED', content: 'Written objection filed by Govind Shinde regarding alignment. Review required.', read: true },
];

const typeStyles: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  SMS: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
  EMAIL: { icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
  GAZETTE: { icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-100' },
  PFMS: { icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
};

const statusStyles: Record<string, string> = {
  DELIVERED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PUBLISHED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  FAILED: 'text-red-700 bg-red-50 border-red-200',
};

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  const [search, setSearch] = useState('');

  const displayNtf = MOCK_NOTIFICATIONS.filter(n => {
    if (activeTab === 'UNREAD' && n.read) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.recipient.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Inbox className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0B3559]">System Communications & Notifications</h1>
            <p className="text-xs text-slate-500">Track SMS, Email, Gazette publications, and PFMS alerts</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`w-full flex items-center justify-between p-3 rounded text-xs font-semibold transition-colors ${activeTab === 'ALL' ? 'bg-[#0B3559] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4" /> All Notifications
            </div>
            <span>{MOCK_NOTIFICATIONS.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('UNREAD')}
            className={`w-full flex items-center justify-between p-3 rounded text-xs font-semibold transition-colors ${activeTab === 'UNREAD' ? 'bg-[#0B3559] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Unread
            </div>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">{unreadCount}</span>
            )}
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">By Category</h3>
            <div className="space-y-1">
              {['SMS', 'EMAIL', 'GAZETTE', 'PFMS'].map(cat => (
                <div key={cat} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 font-medium">
                  <div className={`w-2 h-2 rounded-full ${typeStyles[cat].color.replace('text-', 'bg-')}`} />
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-xs border-none outline-none bg-transparent"
            />
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {displayNtf.map(n => {
              const TIcon = typeStyles[n.type].icon;
              return (
                <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${typeStyles[n.type].bg}`}>
                      <TIcon className={`w-4 h-4 ${typeStyles[n.type].color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 whitespace-nowrap ml-2">{n.timestamp}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-600 mb-2">To: {n.recipient}</div>
                      <p className={`text-xs ${!n.read ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{n.content}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${statusStyles[n.status]}`}>
                          {n.status}
                        </span>
                        {!n.read && (
                          <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {displayNtf.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No notifications found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
