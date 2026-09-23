'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useStoreSettings } from '@/context/StoreSettingsContext';

export default function ContactPage() {
  const { settings } = useStoreSettings();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'ZOHAN E-SECURITY',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate inquiry submission
    setSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const text = `*Inquiry from Zohan Traders Website*%0A*Name:* ${form.name || 'Anonymous'}%0A*Phone:* ${form.phone || 'N/A'}%0A*Department:* ${form.department}%0A*Message:* ${form.message || 'Please provide quotation.'}`;
    const cleanNumber = (settings.whatsapp || '923338586852').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zohan-gold">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Contact ZOHAN TRADERS
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Reach our head office on Jampur Road, DG Khan. Our commercial desk is available for project inquiries, tender submissions, and bulk wholesale rates.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Headquarters & Contact
              </h3>

              <div className="space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-zohan-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Address:</strong>
                    <span className="text-slate-600 block mt-0.5 leading-relaxed">
                      {settings.address || 'Jampur Road, DG Khan, Pakistan'}
                    </span>
                    <a
                      href={settings.googleMapsUrl || 'https://maps.app.goo.gl/qRNjuofwZ9iXcyUVA'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zohan-red font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>Open Google Maps Pin</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Phone Helpline:</strong>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-slate-600 hover:text-zohan-red font-medium block mt-0.5"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Official Email:</strong>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-slate-600 hover:text-zohan-red font-medium block mt-0.5"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs">Business Hours:</strong>
                    <span className="text-slate-600 block mt-0.5">
                      Monday to Saturday: 9:00 AM – 8:00 PM
                    </span>
                    <span className="text-slate-400 block text-[11px]">Sunday: On-call emergency dispatch</span>
                  </div>
                </div>
              </div>

              {/* Tax Details Box */}
              <div className="pt-4 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">NTN Registration:</span>
                  <span className="font-mono font-bold text-slate-800">{settings.ntn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">STRN Sales Tax:</span>
                  <span className="font-mono font-bold text-slate-800">{settings.strn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Send a Direct Message or Tender Inquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out the form below or launch direct WhatsApp messaging with our commercial staff.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">
                    Thank You for Contacting ZOHAN TRADERS!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Your inquiry has been logged. Our commercial sales engineer will contact you shortly via phone or email.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-semibold text-emerald-800 underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Full Name / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MCB Bank Branch / Muhammad Ali"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0333 1234567"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. procurement@bank.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Relevant Department
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red font-medium"
                      >
                        <option value="ZOHAN E-SECURITY">ZOHAN E-SECURITY (CCTV & Gates)</option>
                        <option value="ZOHAN NETWORKS">ZOHAN NETWORKS (Fiber & Wireless)</option>
                        <option value="ZOHAN CONSTRUCTIONS">ZOHAN CONSTRUCTIONS (Bricks, Tiles & Furniture)</option>
                        <option value="ZOHAN STATIONARY">ZOHAN STATIONARY (Paper & Supplies)</option>
                        <option value="OTHER">General Commercial Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Project Details / Bill of Quantities (BOQ) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please specify item quantities, models, delivery location, or timeline..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zohan-red"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-zohan-red hover:bg-zohan-red-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Direct WhatsApp Send</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Location Embed & Directions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zohan-red">
                GPS Location
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Headquarters on Jampur Road, DG Khan
              </h3>
            </div>
            <a
              href={settings.googleMapsUrl || 'https://maps.app.goo.gl/qRNjuofwZ9iXcyUVA'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-zohan-gold" />
            </a>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
            <iframe
              title="Zohan Traders DG Khan Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110543.83401584282!2d70.57008169999999!3d30.056086399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393739bf834b22c7%3A0xe54d2417e25287f3!2sDera%20Ghazi%20Khan%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
