import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-lgu-blue-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions or suggestions? We'd love to hear from you. Reach out to the Sangguniang Bayan Secretariat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-lgu-blue-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-lgu-blue-50 p-3 rounded-lg mr-4 text-lgu-blue-900">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Office Address</h3>
                  <p className="text-slate-600 leading-relaxed">
                    COME AND VISIT US AT<br />
                    2ND FLOOR LEGISLATIVE BUILDING<br />
                    BATUAN MUNICIPAL HALL<br />
                    BATUAN, BOHOL
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-lgu-blue-50 p-3 rounded-lg mr-4 text-lgu-blue-900">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Phone Number</h3>
                  <p className="text-slate-600">(038) 417-5000</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-lgu-blue-50 p-3 rounded-lg mr-4 text-lgu-blue-900">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Email Address</h3>
                  <p className="text-slate-600">SangguniangBayan@lgubatuan.gov.ph</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-lgu-blue-50 p-3 rounded-lg mr-4 text-lgu-blue-900">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">Office Hours</h3>
                  <p className="text-slate-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div className="bg-slate-200 rounded-2xl h-80 flex items-center justify-center overflow-hidden relative border border-slate-200 shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.334460517435!2d124.1462!3d9.7845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aa376666666667%3A0x7b8b8b8b8b8b8b8b!2sBatuan%20Municipal%20Hall!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Batuan Municipal Hall Map"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-serif font-bold text-lgu-blue-900 mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900" placeholder="juan@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900" placeholder="Inquiry about Ordinance No. 123" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
              <textarea rows={6} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-lgu-blue-900 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="w-full bg-lgu-blue-900 text-white font-bold py-3 rounded-lg hover:bg-lgu-blue-800 transition-colors flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
