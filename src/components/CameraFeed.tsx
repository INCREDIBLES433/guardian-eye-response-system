
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface CameraData {
  id: string;
  location: string;
  status: 'active' | 'offline' | 'alert';
  lastDetection?: Date;
  aiConfidence?: number;
}

const CameraFeed = () => {
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('CAM-1');

  useEffect(() => {
    const initialCameras: CameraData[] = [
      { id: 'CAM-1', location: 'Main St & 5th Ave', status: 'active' },
      { id: 'CAM-2', location: 'Highway 101 Mile 23', status: 'alert', lastDetection: new Date(), aiConfidence: 94 },
      { id: 'CAM-3', location: 'Central Plaza', status: 'active' },
      { id: 'CAM-4', location: 'Oak Street Bridge', status: 'offline' },
      { id: 'CAM-5', location: 'Industrial District', status: 'active' },
      { id: 'CAM-6', location: 'Downtown Intersection', status: 'active' },
    ];
    setCameras(initialCameras);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'alert': return 'bg-red-500 animate-pulse';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Eye className="w-4 h-4" />;
      case 'offline': return <EyeOff className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Camera className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Camera className="w-5 h-5 mr-2" />
          Live Camera Feeds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Feed Display */}
        <div className="relative">
          <div className="aspect-video bg-slate-900 rounded-lg border border-slate-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            <div className="relative z-10 text-center">
              <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">
                Camera {selectedCamera} - Live Feed
              </p>
              <p className="text-xs text-slate-500 mt-2">
                AI Analysis: Real-time object detection active
              </p>
            </div>
            
            {/* Simulated detection overlay */}
            {cameras.find(c => c.id === selectedCamera)?.status === 'alert' && (
              <div className="absolute inset-0 border-4 border-red-500 animate-pulse rounded-lg">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                  🚨 INCIDENT DETECTED
                </div>
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm">
                  AI Confidence: {cameras.find(c => c.id === selectedCamera)?.aiConfidence}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cameras.map((camera) => (
            <Button
              key={camera.id}
              variant={selectedCamera === camera.id ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-start space-y-2 ${
                selectedCamera === camera.id ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'
              }`}
              onClick={() => setSelectedCamera(camera.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium">{camera.id}</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(camera.status)}
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`} />
                </div>
              </div>
              <div className="text-xs text-left text-gray-300 line-clamp-2">
                {camera.location}
              </div>
              {camera.status === 'alert' && (
                <Badge variant="destructive" className="text-xs">
                  ALERT
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* AI Processing Status */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">AI Processing Status:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Models Running:</span>
            <span className="text-blue-400">Vehicle Detection, Collision Analysis</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
