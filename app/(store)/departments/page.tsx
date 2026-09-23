'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Building,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Phone,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function DepartmentsPage() {
  const { settings } = useStoreSettings();

  const departments = [
    {
      id: 'security',
      title: 'ZOHAN E-SECURITY',
      subtitle: 'Surveillance, Access Control & Physical Perimeter Defense',
      desc: 'Our E-Security division delivers end-to-end mission-critical security architectures. From multi-story IP surveillance with AI facial analytics to physical perimeter electrified barrier fences and airport-grade metal detector gates.',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop',
      catalogSlug: 'security',
      capabilities: [
        'Hikvision & Dahua 4K ColorVu IP CCTV with AI Vehicle & Person Recognition',
        'ZKTeco Multi-Zone Walkthrough Metal Detectors with Passenger Counter',
        'Biometric Face, Palm & RFID Access Control for Secure Server Rooms',
        'Addressable Fire Alarm Panels, Optical Smoke Detectors & Sounders',
        'Industrial High-Tensile Razor Wire & High-Voltage Electric Fencing',
        'Personal Protective Equipment (PPE) & High-Visibility Safety Gear',
      ],
      clients: 'MCB Bank, DHQ Hospital DG Khan, Fauji Cement, DG Khan Gymkhana Club',
    },
    {
      id: 'networks',
      title: 'ZOHAN NETWORKS',
      subtitle: 'Long-Range Wireless Backhaul, Fiber Optics & Gigabit Infrastructure',
      desc: 'Zohan Networks designs and provides high-bandwidth data transmission systems. Specializing in point-to-point and point-to-multipoint microwave bridges connecting remote facilities up to 25+ KM without laying expensive fiber.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop',
      catalogSlug: 'it-products',
      capabilities: [
        'Ubiquiti airMAX LiteBeam, PowerBeam & AirFiber 5GHz/60GHz Backhauls',
        'Pure Solid Copper Fast Cables CAT6 / CAT7 Shielded Data Cabling',
        'D-Link & Cisco Enterprise Managed PoE+ Layer-2/Layer-3 Switches',
        'Single-Mode / Multi-Mode Armored Optical Fiber & SFP+ Modules',
        'Server Racks, Structured Patch Panels & Cable Management Systems',
        'Enterprise Desktop Workstations, Corporate Laptops & Micro PCs',
      ],
      clients: 'PTCL DG Khan, Wateen Telecom, Mobilink, Doctors Hospital DG Khan',
    },
    {
      id: 'constructions',
      title: 'ZOHAN CONSTRUCTIONS',
      subtitle: 'Multani Clay Bricks, Tuff Tiles, Sanitaryware & Executive Furniture',
      desc: 'Supplying bulk raw building supplies and turn-key interior fit-out solutions directly to construction companies, municipal works, and commercial developers throughout Punjab and KPK.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=1000&auto=format&fit=crop',
      catalogSlug: 'construction',
      capabilities: [
        'First-Class Awal Grade Kiln-Fired Multani Clay Bricks (High Density)',
        'Hydraulic Interlocking Heavy Tuff Tiles (60mm & 80mm Commercial Spec)',
        'Architectural Aluminium Frames, Tinted Tempered Glass & Balustrades',
        'Master Sanitary Luxury Water Closets, Ceramic Vanities & Chrome Mixers',
        'Fine River Ravi & Chenab Sands for Concrete & Plastering Works',
        'Interwood Modular 4-Person Workstations, Executive Orthopedic Chairs',
      ],
      clients: 'Fauji Cement, Sinoma International, DG Khan Commercial Plazas',
    },
    {
      id: 'stationary',
      title: 'ZOHAN STATIONARY',
      subtitle: 'High-Volume Copier Papers, Archival Filing & Workplace Stationery',
      desc: 'Bulk institutional stationery contractor catering to bank regional head offices, judicial courts, colleges, and hospitals requiring consistent high-opacity paper and tamper-proof archival folders.',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop',
      catalogSlug: 'stationery',
      capabilities: [
        'Double A & PaperOne 80 GSM Jam-Free Ultra-White Copier Paper Boxes',
        'Heavy-Duty Multi-Tier Sliding Steel Mesh Desktop Document Organizers',
        'Official Archival Box Files, Lever-Arch Binders & Legal Folders',
        'Continuous Computer Stationery & Thermal Billing Paper Rolls',
        'Permanent Marker Pens, Ballpoints, Stamp Pads & Ledger Registers',
        'Toner Cartridges for HP, Canon & Xerox High-Speed Printers',
      ],
      clients: 'HBL, Silk Bank, Zarai Taraqiati Bank, CRDI, Pharmevo',
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
              Specialized Divisions
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              The 4 Core Operational Departments
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover our structured departments engineered to deliver turnkey supply, engineering deployment, and institutional service contracts across Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Detailed List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {departments.map((dept, index) => {
          const isEven = index % 2 === 1;
          return (
            <div
              key={dept.id}
              id={dept.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md bg-slate-100 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 bg-zohan-red text-white text-xs font-bold px-3 py-1 rounded">
                  {dept.title}
                </span>
              </div>

              {/* Text content */}
              <div className={`space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
                    Department #{index + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    {dept.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                    {dept.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dept.desc}
                </p>

                {/* Capabilities */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                    Core Solutions & Supplies:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {dept.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clients Served */}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <strong className="text-slate-800">Verified Deployments: </strong>
                  {dept.clients}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <Link
                    href={`/shop/${dept.catalogSlug}/`}
                    className="inline-flex items-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/contact/"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span>Request Department Tender</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
