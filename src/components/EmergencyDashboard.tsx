
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, MapPin, Clock, Phone, Users } from 'lucide-react';
import CameraFeed from './CameraFeed';
import HospitalNotifications from './HospitalNotifications';
import IncidentLog from './IncidentLog';
import { useToast } from '@/hooks/use-toast';

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

const EmergencyDashboard = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeCameras, setActiveCameras] = useState(12);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'maintenance'>('online');
  const { toast } = useToast();

  // Simulate real-time incident detection
  useEffect(() => {
    const simulateIncident = () => {
      const locations = [
        'MG Road & Brigade Road', 'NH-48 Km 234', 'Connaught Place',
        'Bandra-Worli Sea Link', 'Industrial Area Phase II', 'Rajiv Chowk Metro Station'
      ];
      
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
      const descriptions = [
        'Vehicle collision detected', 'Pedestrian incident', 'Multi-vehicle accident',
        'Emergency vehicle needed', 'Traffic obstruction', 'Medical emergency'
      ];

      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newIncident: Incident = {
          id: Date.now().toString(),
          timestamp: new Date(),
          location: locations[Math.floor(Math.random() * locations.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          cameraId: `CAM-${Math.floor(Math.random() * 12) + 1}`,
          notificationsSent: 0,
          status: 'detected'
        };

        setIncidents(prev => [newIncident, ...prev.slice(0, 9)]);
        
        toast({
          title: "🚨 Incident Detected",
          description: `${newIncident.description} at ${newIncident.location}`,
          variant: newIncident.severity === 'critical' ? 'destructive' : 'default',
        });
      }
    };

    const interval = setInterval(simulateIncident, 10000);
    return () => clearInterval(interval);
  }, [toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      case 'critical': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                AI Aapda Pratikriya
              </h1>
            </div>
            <Badge variant="outline" className={`${getStatusColor(systemStatus)} border-current`}>
              <div className="w-2 h-2 rounded-full bg-current mr-2" />
              System {systemStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Time</div>
            <div className="text-lg font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Active Cameras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{activeCameras}</div>
            <div className="text-xs text-gray-500">Monitoring citywide</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {incidents.filter(i => i.status !== 'responded').length}
            </div>
            <div className="text-xs text-gray-500">Requires attention</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Notifications Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {incidents.reduce((sum, i) => sum + i.notificationsSent, 0)}
            </div>
            <div className="text-xs text-gray-500">To hospitals today</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2.3min</div>
            <div className="text-xs text-gray-500">Average today</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feeds */}
        <div className="lg:col-span-2">
          <CameraFeed />
        </div>

        {/* Hospital Notifications */}
        <div>
          <HospitalNotifications incidents={incidents} setIncidents={setIncidents} />
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="mt-6">
        <IncidentLog incidents={incidents} />
      </div>
    </div>
  );
};

export default EmergencyDashboard;
