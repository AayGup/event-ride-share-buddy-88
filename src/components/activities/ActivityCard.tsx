import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Car, Clock, ArrowRight } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  date: string;
  time?: string;
  campus: "Apple Hill" | "Lakeside";
  participantCount: number;
}

interface ActivityCardProps {
  activity: Activity;
  onJoinCarpool: (activityId: string) => void;
}

export function ActivityCard({ activity, onJoinCarpool }: ActivityCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if there are saved scheduler details for this activity
  const getSchedulerData = () => {
    const saved = localStorage.getItem(`poolup-scheduler-${activity.id}`);
    return saved ? JSON.parse(saved) : [];
  };

  const timeSlots = getSchedulerData();
  const hasDrivers = timeSlots.some((slot: any) => slot.driverId);
  const totalPassengers = timeSlots.reduce((total: number, slot: any) => total + slot.passengers.length, 0);

  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 cursor-pointer bg-gradient-card border border-border/50 hover:border-primary/20 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:opacity-10 transition-opacity duration-300" />
      
      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                {activity.name}
              </CardTitle>
            </div>
          </div>
          <Badge 
            variant="outline"
            className="text-xs bg-background/50 backdrop-blur-sm border-primary/20"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {activity.campus}
          </Badge>
        </div>
        
        <CardDescription className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {formatDate(activity.date)}
          </div>
          {activity.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {activity.time}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 relative">
        <div className="space-y-3">
          {hasDrivers && (
            <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg border border-success/20">
              <Car className="h-4 w-4 text-success" />
              <span className="text-sm text-black">
                {timeSlots.length} driver{timeSlots.length !== 1 ? 's' : ''} • {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {hasDrivers ? (
                <Badge variant="secondary" className="text-xs">
                  <Car className="h-3 w-3 mr-1" />
                  Active Carpools
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  No drivers yet
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={() => onJoinCarpool(activity.id)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group/btn"
              size="sm"
            >
              <span>{hasDrivers ? 'View Carpools' : 'Join Carpool'}</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
