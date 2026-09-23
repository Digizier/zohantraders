'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Wrench,
  Clock,
  Award,
  CheckCircle2,
  FileCheck,
  Building,
  Microscope,
  ArrowRight,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function WhyChooseUsPage() {
  const { settings } = useStoreSettings();

  const guarantees = [
    {
      icon: ShieldCheck,
      title: '12-Month Replacement Warranty',
      desc: 'All enterprise security cameras, network switches, and wireless bridges purchased from Zohan Traders carry our direct replacement guarantee against manufacturing defects, saving you weeks of manufacturer RMA delays.',
      color: 'bg-red-50 text-zohan-red',
    },
    {
      icon: Wrench,
      title: '5-Year Spare Parts & Repair Continuity',
      desc: 'We stock genuine internal replacement components, camera sensors, power supplies, and brackets for a minimum of 5 years, ensuring your institutional installations are never abandoned.',
      color: 'bg-amber-50 text-zohan-gold',
    },
    {
      icon: Clock,
      title: '24-Hour Technical Dispatch & Response',
      desc: 'For banking and hospital clients experiencing critical security or network downtime in South Punjab, our field technicians respond on-site within 24 hours of notification.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Microscope,
      title: 'In-House Testing Laboratory',
      desc: 'No equipment leaves our warehouse without passing a multi-point stress test, firmware flash, PoE continuity test, and physical inspection by certified technicians.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: FileCheck,
      title: '100% Tax Compliant & Registered',
      desc: 'Fully registered with the Federal Board of Revenue (NTN: 7539474-3) and Punjab Revenue Authority (STRN: 3277876288512). We provide standard sales tax invoices for institutional audits.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Building,
      title: 'Direct Source Pricing (Zero Middlemen)',
      desc: 'By sourcing bulk containers directly from prime manufacturers and maintaining our own clay brick kilns in Multan and DG Khan, we pass substantial wholesale savings to our clients.',
      color: 'bg-slate-100 text-slate-800',
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
              The Zohan Advantage
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Why Institutional Clients Choose ZOHAN TRADERS
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              In a market crowded with unverified grey-channel electronics and sub-standard building materials, Zohan Traders stands out through certified authenticity, technical rigor, and contractual accountability.
            </p>
          </div>
        </div>
      </section>

      {/* 6 Core Guarantees Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guarantees.map((item, i) => {
            const IconComp = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Procurement Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
              Benchmarking Standards
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              How Zohan Traders Compares to Local Middlemen
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="p-3.5 font-bold uppercase">Procurement Factor</th>
                  <th className="p-3.5 font-bold uppercase text-zohan-red">Zohan Traders</th>
                  <th className="p-3.5 font-bold uppercase text-slate-500">Unverified Traders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Warranty Backing</td>
                  <td className="p-3.5 text-emerald-700 font-bold">12-Month Official Direct Replacement</td>
                  <td className="p-3.5 text-slate-500">None or 7-day checking only</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Pre-Dispatch Testing</td>
                  <td className="p-3.5 text-emerald-700 font-bold">Comprehensive Bench Lab Inspection</td>
                  <td className="p-3.5 text-slate-500">Untested boxed delivery</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">FBR Tax Invoicing</td>
                  <td className="p-3.5 text-emerald-700 font-bold">Active NTN & STRN Sales Tax Invoices</td>
                  <td className="p-3.5 text-slate-500">Handwritten receipts / Non-filer</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Hardware Authenticity</td>
                  <td className="p-3.5 text-emerald-700 font-bold">100% Brand Certified Original</td>
                  <td className="p-3.5 text-slate-500">High risk of counterfeit/refurbished</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">Spare Parts Continuity</td>
                  <td className="p-3.5 text-emerald-700 font-bold">5-Year Component Inventory</td>
                  <td className="p-3.5 text-slate-500">No spare parts support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black">
            Experience the Professional Standard Today
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join hundreds of satisfied bank branches, telecom managers, and builders across Pakistan.
          </p>
          <div className="pt-2">
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-colors"
            >
              <span>Explore Products & Start Ordering</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
