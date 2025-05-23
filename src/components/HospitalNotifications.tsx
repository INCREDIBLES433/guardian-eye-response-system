
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Users, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Hospital {
  id: string;
  name: string;
  distance: string;
  estimatedTime: string;
  capacity: 'low' | 'medium' | 'high';
  specialties: string[];
  phone: string;
}

interface Incident {
  id: string;
  timestamp: Date;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cameraId: string;
  notificationsSent: number;
  status: 'detected' | 'notified' | 'responded';
}

interface HospitalNotificationsProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
}

const HospitalNotifications: React.FC<HospitalNotificationsProps> = ({ incidents, setIncidents }) => {
  const [hospitals] = useState<Hospital[]>([
    {
      id: 'H1',
      name: 'AIIMS Delhi',
      distance: '0.8 km',
      estimatedTime: '3 min',
      capacity: 'high',
      specialties: ['Emergency', 'Trauma', 'Surgery'],
      phone: '+91 11 2658 8500'
    },
    {
      id: 'H2',
      name: 'Apollo Hospitals',
      distance: '1.2 km',
      estimatedTime: '4 min',
      capacity: 'medium',
      specialties: ['Emergency', 'Cardiology'],
      phone: '+91 44 2829 3333'
    },
    {
      id: 'H3',
      name: 'Fortis Hospital',
      distance: '2.1 km',
      estimatedTime: '6 min',
      capacity: 'high',
      specialties: ['Trauma', 'Surgery', 'ICU'],
      phone: '+91 11 4277 6222'
    }
  ]);

  const { toast } = useToast();

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'border-yellow-500';
      case 'medium': return 'border-orange-500';
      case 'high': return 'border-red-500';
      case 'critical': return 'border-red-700';
      default: return 'border-gray-500';
    }
  };

  const sendNotification = (hospitalId: string, incidentId: string) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    const incident = incidents.find(i => i.id === incidentId);
    
    if (hospital && incident) {
      setIncidents(prev => prev.map(i => 
        i.id === incidentId 
          ? { ...i, notificationsSent: i.notificationsSent + 1, status: 'notified' as const }
          : i
      ));

      toast({
        title: "🚑 Notification Sent",
        description: `${hospital.name} has been notified about the incident at ${incident.location}`,
      });
    }
  };

  const activeIncidents = incidents.filter(i => i.status !== 'responded').slice(0, 3);

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Phone className="w-5 h-5 mr-2" />
          Hospital Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Incidents Requiring Notification */}
        {activeIncidents.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">Pending Notifications</h3>
            {activeIncidents.map((incident) => (
              <div key={incident.id} className={`p-3 border-l-4 ${getSeverityColor(incident.severity)} bg-slate-700 rounded`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{incident.description}</p>
                    <p className="text-xs text-gray-400">{incident.location}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {incident.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {incident.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nearest Hospitals */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Nearest Hospitals</h3>
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="p-4 bg-slate-700 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white">{hospital.name}</h4>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {hospital.distance} • {hospital.estimatedTime}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Capacity</div>
                  <div className={`text-sm font-medium ${getCapacityColor(hospital.capacity)}`}>
                    {hospital.capacity.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {hospital.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <Phone className="w-3 h-3 inline mr-1" />
                  {hospital.phone}
                </div>
                {activeIncidents.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => sendNotification(hospital.id, activeIncidents[0].id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Notify
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="border-t border-slate-600 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Response Network:</span>
            <span className="text-blue-400">{hospitals.length} hospitals</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Avg Response Time:</span>
            <span className="text-green-400">2.3 minutes</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Coverage Radius:</span>
            <span className="text-purple-400">5 kilometers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalNotifications;
