'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Target,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function AboutPage() {
  const { settings } = useStoreSettings();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
              Company Profile & Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Empowering Security, IT & Infrastructure Since 2017
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ZOHAN TRADERS has grown into one of South Punjab’s most trusted government and institutional suppliers, providing end-to-end electronic security, networking architecture, structural building materials, and corporate workplace furnishings.
            </p>
          </div>
        </div>
      </section>

      {/* Official Registrations Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-zohan-red flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Federal NTN</div>
              <div className="text-lg font-mono font-black text-slate-900">{settings.ntn}</div>
              <div className="text-[11px] text-slate-500">Active Taxpayer Verified</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-zohan-gold flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Sales Tax (STRN)</div>
              <div className="text-lg font-mono font-black text-slate-900">{settings.strn}</div>
              <div className="text-[11px] text-slate-500">General Sales Tax Registered</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Establishment</div>
              <div className="text-lg font-black text-slate-900">Year 2017</div>
              <div className="text-[11px] text-slate-500">9+ Years of Institutional Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 border border-slate-700/60 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-zohan-red text-white flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">Our Strategic Vision</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To be Pakistan’s foremost multi-disciplinary trading house and government contractor, recognized for uncompromising material integrity, technical excellence, and rapid project commissioning across commercial and public sector developments.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 border border-slate-700/60 shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-xl bg-zohan-gold text-slate-950 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">Our Operating Mission</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To bridge institutional procurement bottlenecks by delivering certified brand-authentic security technology, industrial IT networks, and structural construction raw materials on schedule, backstopped with our ironclad 12-month replacement warranty and dedicated local service lab.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
            Milestones
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Our Journey & Growth
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-zohan-red">2017</span>
            <h4 className="text-sm font-bold text-slate-900">Foundation in DG Khan</h4>
            <p className="text-xs text-slate-600">
              Launched as a specialized supplier of building raw materials and commercial stationery for public sector tenders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-zohan-gold">2019</span>
            <h4 className="text-sm font-bold text-slate-900">E-Security Expansion</h4>
            <p className="text-xs text-slate-600">
              Forged official distribution relationships with Hikvision, Dahua, and ZKTeco, deploying bank security infrastructure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-blue-600">2021</span>
            <h4 className="text-sm font-bold text-slate-900">IT & Wireless Wings</h4>
            <p className="text-xs text-slate-600">
              Introduced long-distance Ubiquiti microwave wireless bridges and fiber optic networks for corporate campuses and hospital networks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl font-black text-emerald-600">Present</span>
            <h4 className="text-sm font-bold text-slate-900">Full Enterprise Partner</h4>
            <p className="text-xs text-slate-600">
              Trusted by 15+ major banks, telecom operators, and healthcare institutes with full warehouse operations and pre-dispatch testing lab.
            </p>
          </div>
        </div>
      </section>

      {/* Testing Lab & Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
                Internal Quality Control
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Pre-Dispatch Bench Testing Laboratory
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike ordinary middlemen, every CCTV camera, network switch, wireless bridge, and biometric terminal undergoes rigorous 24-hour burn-in testing and firmware validation in our DG Khan technical lab before customer dispatch.
              </p>
              <div className="space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fluke Channel Verified network cabling inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PoE voltage drop stress analysis under continuous load</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct brick compressive strength and clay salinity audit</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2">
                Executive Leadership
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Led by seasoned commercial contractors and certified network engineers who understand the mission-critical nature of banking uptime and structural durability.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <span>Connect With Our Directors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
