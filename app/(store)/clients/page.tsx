'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Stethoscope,
  Wifi,
  Factory,
  ArrowRight,
} from 'lucide-react';
import { CORPORATE_CLIENTS, BRAND_PARTNERS } from '@/lib/seed-data';

export default function ClientsPage() {
  const caseStudies = [
    {
      title: 'Commercial Banking CCTV & Access Control Upgrade',
      client: 'MCB & HBL Regional Branches',
      category: 'Banking Sector',
      description: 'Turnkey installation of Hikvision 4K IP security systems, centralized NVR backup storage, and ZKTeco biometric server room access control across 12 branch locations in Southern Punjab.',
      deliverables: '84 IP Cameras, 4 Walkthrough Gates, Biometric Access & 24/7 Monitored Power Backup',
      icon: Landmark,
    },
    {
      title: 'Multi-Building Wireless Campus Interconnect',
      client: 'DHQ Hospital & Medical Facilities DG Khan',
      category: 'Healthcare Sector',
      description: 'Deployment of high-capacity Ubiquiti 5GHz airMAX wireless bridges delivering 450+ Mbps zero-latency data links between diagnostic labs, emergency wards, and administrative wings.',
      deliverables: '8 Ubiquiti LiteBeam Bridges, Gigabit Managed PoE Switches, 2.5 KM Line-of-sight Link',
      icon: Stethoscope,
    },
    {
      title: 'Industrial Plant Perimeter & Structural Supplies',
      client: 'Fauji Cement Company & Sinoma International',
      category: 'Heavy Industry & Manufacturing',
      description: 'Continuous supply of heavy-duty interlocking tuff tiles for heavy transport vehicle roadways, high-tensile razor wire perimeter defense, and certified electrical cabling infrastructure.',
      deliverables: '25,000+ Sq Ft Tuff Tiles, 5,000m Razor Wire, Heavy Industrial Earthing Cables',
      icon: Factory,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
              Institutional Trust
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Corporate Clients & Brand Partners
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Serving premier financial institutions, multinational telecom providers, government healthcare establishments, and industrial heavyweights since 2017.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Clients Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
            Verified Procurement Records
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Major Corporate & Government Clients
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Organizations that rely on Zohan Traders for authentic hardware, timely delivery, and dependable warranty coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORPORATE_CLIENTS.map((client, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-zohan-red flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {client.name}
                </h3>
                <span className="text-xs text-zohan-gold font-semibold block mt-0.5">
                  {client.category}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Active commercial supply & engineering support framework.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Partners Showcase */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
              Direct Manufacturer Alliances
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Authorized Brand Partners
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We source directly from accredited global and national factories, ensuring 100% genuine products with manufacturer warranties.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BRAND_PARTNERS.map((brand, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 text-center flex flex-col justify-center items-center shadow-sm"
              >
                <span className="text-base font-black text-slate-900 tracking-wide uppercase mb-1">
                  {brand.logoText}
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight">
                  {brand.role}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-3 font-semibold">
                  Authorized Source
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
            Field Implementations
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Featured Procurement Deployments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, i) => {
            const IconComp = study.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-zohan-red flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zohan-gold">
                      {study.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {study.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      Client: {study.client}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {study.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Key Scope Delivered:
                  </span>
                  <p className="text-xs font-medium text-slate-800">
                    {study.deliverables}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tender Invitation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Inviting Tenders & RFQs for 2026-2027?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Submit your Bill of Quantities (BOQ) or technical requirement document to our government bidding department for competitive rate quotes.
            </p>
          </div>
          <Link
            href="/contact/"
            className="bg-zohan-red hover:bg-zohan-red-dark text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-lg transition-colors whitespace-nowrap"
          >
            Submit Tender Documents
          </Link>
        </div>
      </section>
    </div>
  );
}
