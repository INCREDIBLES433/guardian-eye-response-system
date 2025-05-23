
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Camera, CheckCircle, AlertTriangle } from 'lucide-react';

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

interface IncidentLogProps {
  incidents: Incident[];
}

const IncidentLog: React.FC<IncidentLogProps> = ({ incidents }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      case 'critical': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'detected': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'notified': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'responded': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-yellow-400 bg-yellow-400/10';
      case 'notified': return 'text-blue-400 bg-blue-400/10';
      case 'responded': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Incidents
          </div>
          <Badge variant="outline" className="text-xs">
            {incidents.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No incidents detected</p>
            <p className="text-sm mt-1">System monitoring active</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-start space-x-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(incident.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        {incident.description}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {incident.location}
                        </div>
                        <div className="flex items-center">
                          <Camera className="w-3 h-3 mr-1" />
                          {incident.cameraId}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {incident.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(incident.severity)}`} />
                      <Badge variant="outline" className="text-xs">
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className={`text-xs ${getStatusColor(incident.status)}`}>
                      {incident.status.toUpperCase()}
                    </Badge>
                    
                    {incident.notificationsSent > 0 && (
                      <div className="text-xs text-gray-400">
                        {incident.notificationsSent} notification{incident.notificationsSent !== 1 ? 's' : ''} sent
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentLog;
