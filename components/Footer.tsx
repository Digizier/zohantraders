'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  Award,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { INITIAL_CATEGORIES } from '@/lib/seed-data';

export function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-zohan-red pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white p-1 shadow-md flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Zohan Traders"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  ZOHAN <span className="text-zohan-red">TRADERS</span>
                </span>
                <p className="text-[11px] text-zohan-gold font-medium">
                  Est. 2017 • Gov & Enterprise Supplies
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline || 'Your Trusted Partner for Security, IT & Construction Solutions'}. Official registered supplier providing certified equipment, structural raw materials, and enterprise IT hardware.
            </p>

            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">NTN Registration:</span>
                <span className="text-white font-mono font-bold">{settings.ntn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sales Tax (STRN):</span>
                <span className="text-white font-mono font-bold">{settings.strn}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Departments */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-zohan-red pl-2">
              4 Core Departments
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/departments/#security"
                  className="hover:text-zohan-gold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zohan-red"></span>
                  <strong>ZOHAN E-SECURITY</strong>
                </Link>
                <span className="text-[11px] text-slate-400 pl-3 block">
                  CCTV, Access Control & Perimeter Defense
                </span>
              </li>
              <li>
                <Link
                  href="/departments/#networks"
                  className="hover:text-zohan-gold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zohan-red"></span>
                  <strong>ZOHAN NETWORKS</strong>
                </Link>
                <span className="text-[11px] text-slate-400 pl-3 block">
                  Wireless Bridges, Fiber & Switches
                </span>
              </li>
              <li>
                <Link
                  href="/departments/#constructions"
                  className="hover:text-zohan-gold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zohan-red"></span>
                  <strong>ZOHAN CONSTRUCTIONS</strong>
                </Link>
                <span className="text-[11px] text-slate-400 pl-3 block">
                  Multani Bricks, Tuff Tiles & Furniture
                </span>
              </li>
              <li>
                <Link
                  href="/departments/#stationary"
                  className="hover:text-zohan-gold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zohan-red"></span>
                  <strong>ZOHAN STATIONARY</strong>
                </Link>
                <span className="text-[11px] text-slate-400 pl-3 block">
                  Corporate Bulk Paper & Organizers
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-zohan-gold pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop/" className="hover:text-white transition-colors">
                  Product Catalog & Store
                </Link>
              </li>
              <li>
                <Link href="/clients/" className="hover:text-white transition-colors">
                  Banking & Corporate Clients
                </Link>
              </li>
              <li>
                <Link href="/why-choose-us/" className="hover:text-white transition-colors">
                  Testing Lab & Guarantees
                </Link>
              </li>
              <li>
                <Link href="/about/" className="hover:text-white transition-colors">
                  Company Background & History
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-white transition-colors">
                  Contact Us & Location Map
                </Link>
              </li>
              <li>
                <Link href="/admin/" className="text-slate-400 hover:text-zohan-gold transition-colors flex items-center gap-1">
                  <span>Authorized Staff Portal</span> &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Location */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-zohan-red pl-2">
              Contact & Headquarters
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href={settings.googleMapsUrl || "https://maps.app.goo.gl/qRNjuofwZ9iXcyUVA"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 text-zohan-red flex-shrink-0 mt-0.5" />
                <span>
                  {settings.address || 'Jampur Road, DG Khan, Pakistan'}
                  <span className="text-zohan-gold group-hover:underline block text-[11px] mt-0.5">
                    View on Google Maps &rarr;
                  </span>
                </span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{settings.phone}</span>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{settings.email}</span>
              </a>

              <div className="flex items-center gap-2.5 text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>

            {/* Direct Google Maps Shortcut */}
            <div className="pt-2">
              <a
                href={settings.googleMapsUrl || "https://maps.app.goo.gl/qRNjuofwZ9iXcyUVA"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-zohan-gold" />
                <span>Open Google Maps Pin</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} <strong>ZOHAN TRADERS</strong>. All rights reserved. NTN: {settings.ntn}.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Genuine Supplies Guaranteed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
