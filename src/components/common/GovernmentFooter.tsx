import React from 'react';
import { Link } from 'react-router-dom';

export const GovernmentFooter: React.FC = () => {
  return (
    <footer className="site-footer bg-[#0B3559] border-t-4 border-[#082541] text-white pt-8 pb-6 px-4 md:px-8 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-6 border-b border-white/20 text-xs">

          {/* Brand & Contacts */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <svg className="w-8 h-8 shrink-0 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M24 4 6 11v11c0 12 8 19 18 22 10-3 18-10 18-22V11L24 4Z" />
                <path d="M24 18a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
              </svg>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-tight">BHOOMISETU</h3>
                <p className="text-[11px] text-white/70">National Land Acquisition &amp; Management System</p>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed text-[11px] max-w-sm">
              A unified platform for land acquisition, compensation, rehabilitation and resettlement administered under the applicable Land Acquisition Act.
            </p>

            <ul className="space-y-1.5 text-[11px] text-white/90 pt-1">
              <li className="flex items-center space-x-2">
                <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v9A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 17.5 4h-15ZM2.5 5.5h15l-7.5 5.5-7.5-5.5Zm15 1.838v7.162h-15V7.338l7.5 5.5 7.5-5.5Z"/>
                </svg>
                <a href="mailto:helpdesk-bhoomisetu@gov.in" className="hover:underline">helpdesk-bhoomisetu@gov.in</a>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M3.6 2.2a1.5 1.5 0 0 0-2.1.3l-1 1.4c-.6.9-.5 2.1.2 3.1 2.2 3.4 5.2 6.4 8.6 8.6 1 .7 2.2.8 3.1.2l1.4-1a1.5 1.5 0 0 0 .3-2.1l-2.4-3.2a1.5 1.5 0 0 0-2.1-.2l-1.1.9c-.3.2-.7.2-1-.1-1.3-1-2.3-2-3.3-3.3-.3-.3-.3-.7-.1-1l.9-1.1a1.5 1.5 0 0 0-.2-2.1L3.6 2.2Z"/>
                </svg>
                <a href="tel:18000000000" className="hover:underline">1800-000-0000 (Toll-free)</a>
              </li>
              <li className="flex items-center space-x-2 text-white/80">
                <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 2a6 6 0 0 0-6 6c0 4.4 6 10 6 10s6-5.6 6-10a6 6 0 0 0-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
                </svg>
                <span>Department of Land Resources, New Delhi</span>
              </li>
            </ul>
          </div>

          {/* Column 1: Modules */}
          <nav aria-label="Modules" className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Modules</h4>
            <ul className="space-y-1 text-[11px] text-white/70">
              <li><Link to="/dashboard" className="hover:text-white hover:underline">Dashboard</Link></li>
              <li><Link to="/projects" className="hover:text-white hover:underline">Projects</Link></li>
              <li><Link to="/parcels" className="hover:text-white hover:underline">Land Parcels</Link></li>
              <li><Link to="/gis-map" className="hover:text-white hover:underline">GIS Map</Link></li>
              <li><Link to="/reports" className="hover:text-white hover:underline">Reports &amp; MIS</Link></li>
            </ul>
          </nav>

          {/* Column 2: Governance */}
          <nav aria-label="Governance" className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Governance</h4>
            <ul className="space-y-1 text-[11px] text-white/70">
              <li><Link to="/workflow" className="hover:text-white hover:underline">Acts &amp; Rules</Link></li>
              <li><Link to="/notifications" className="hover:text-white hover:underline">Notifications</Link></li>
              <li><a href="#" className="hover:text-white hover:underline">RTI</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Grievance Redressal</a></li>
              <li><Link to="/audit-trail" className="hover:text-white hover:underline">Audit Trail</Link></li>
            </ul>
          </nav>

          {/* Column 3: Important Links */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-white">Important Links</h4>
            <ul className="space-y-1 text-[11px] text-white/70">
              <li><a href="#" className="hover:text-white hover:underline">India.gov.in — National Portal</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Digital India</a></li>
              <li><a href="#" className="hover:text-white hover:underline">MeitY — Ministry of Electronics</a></li>
              <li><a href="#" className="hover:text-white hover:underline">data.gov.in — Open Data Platform</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-3 border-b border-white/20 text-[11px] text-white/70">
          <p>
            Content on this portal is published and managed by the Department of Land Resources, Ministry of Rural Development, Government of India. Last Reviewed: 05 September 2026.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-white/70">
          <div>
            &copy; 2026 BHOOMISETU. Content owned by the Department of Land Resources.
          </div>
          <div className="flex flex-wrap gap-4 text-white/70">
            <a href="#" className="hover:text-white hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-white hover:underline">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white hover:underline">Accessibility Statement</a>
            <a href="#" className="hover:text-white hover:underline">Sitemap</a>
            <a href="#" className="hover:text-white hover:underline">Screen Reader Access</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
