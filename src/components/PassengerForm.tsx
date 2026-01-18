'use client';

import { useState } from 'react';
import { User, Mail, Phone, Calendar, Globe } from 'lucide-react';
import type { Traveler } from '@/types/amadeus';

interface PassengerFormProps {
  passengerCount: number;
  onSubmit: (travelers: Traveler[]) => void;
  isLoading?: boolean;
}

export default function PassengerForm({ passengerCount, onSubmit, isLoading = false }: PassengerFormProps) {
  const [passengers, setPassengers] = useState<Partial<Traveler>[]>(
    Array.from({ length: passengerCount }, (_, i) => ({
      id: (i + 1).toString(),
      name: { firstName: '', lastName: '' },
      dateOfBirth: '',
      gender: 'MALE' as const,
      contact: {
        emailAddress: '',
        phones: [{ deviceType: 'MOBILE' as const, countryCallingCode: '1', number: '' }],
      },
    }))
  );

  const updatePassenger = (index: number, field: string, value: any) => {
    const updated = [...passengers];
    const keys = field.split('.');
    let current: any = updated[index];
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setPassengers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(passengers as Traveler[]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Passenger Information</h2>

      {passengers.map((passenger, index) => (
        <div key={index} className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">
            Passenger {index + 1} {index === 0 && '(Primary Contact)'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline mr-2" size={16} />
                First Name *
              </label>
              <input
                type="text"
                value={passenger.name?.firstName || ''}
                onChange={(e) => updatePassenger(index, 'name.firstName', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline mr-2" size={16} />
                Last Name *
              </label>
              <input
                type="text"
                value={passenger.name?.lastName || ''}
                onChange={(e) => updatePassenger(index, 'name.lastName', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Doe"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline mr-2" size={16} />
                Date of Birth *
              </label>
              <input
                type="date"
                value={passenger.dateOfBirth || ''}
                onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Globe className="inline mr-2" size={16} />
                Gender *
              </label>
              <select
                value={passenger.gender || 'MALE'}
                onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Email (only for first passenger) */}
            {index === 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={passenger.contact?.emailAddress || ''}
                  onChange={(e) => updatePassenger(index, 'contact.emailAddress', e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="john.doe@example.com"
                />
              </div>
            )}

            {/* Phone (only for first passenger) */}
            {index === 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={passenger.contact?.phones?.[0]?.countryCallingCode || '1'}
                    onChange={(e) => updatePassenger(index, 'contact.phones.0.countryCallingCode', e.target.value)}
                    required
                    className="w-20 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="+1"
                  />
                  <input
                    type="tel"
                    value={passenger.contact?.phones?.[0]?.number || ''}
                    onChange={(e) => updatePassenger(index, 'contact.phones.0.number', e.target.value)}
                    required
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          'Continue to Review'
        )}
      </button>
    </form>
  );
}
