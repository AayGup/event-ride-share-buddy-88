import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, MapPin, FileText, Users } from "lucide-react";

interface DriverSlot {
  id: string;
  time: string;
  driverId: string;
  driverName: string;
  location: string;
  note?: string;
  capacity: number;
  passengers: string[];
}

interface DriverListProps {
  drivers: DriverSlot[];
  currentUserId: string;
  onJoinDriver: (driverId: string) => void;
  onLeaveDriver: (driverId: string) => void;
}

export function DriverList({ drivers, currentUserId, onJoinDriver, onLeaveDriver }: DriverListProps) {
  const sortedDrivers = drivers.sort((a, b) => a.time.localeCompare(b.time));

  if (drivers.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Drivers Yet</h3>
          <p className="text-muted-foreground">
            No drivers have signed up for this event yet. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Available Drivers ({drivers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDrivers.map((driver) => {
            const isJoined = driver.passengers.includes(currentUserId);
            const availableSpots = driver.capacity - driver.passengers.length;
            const isFull = availableSpots === 0;

            return (
              <div
                key={driver.id}
                className="border border-border rounded-lg p-4 space-y-3 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{driver.driverName}</h4>
                      {isJoined && (
                        <Badge variant="secondary" className="text-xs">
                          Joined
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {driver.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {driver.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {driver.passengers.length}/{driver.capacity}
                      </div>
                    </div>
                    
                    {driver.note && (
                      <div className="flex items-start gap-2 text-sm bg-muted/50 rounded p-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{driver.note}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={isFull ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {isFull ? "Full" : `${availableSpots} spot${availableSpots === 1 ? '' : 's'} left`}
                    </Badge>
                    
                    {isJoined ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLeaveDriver(driver.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Leave
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => onJoinDriver(driver.id)}
                        disabled={isFull}
                        className="bg-gradient-primary"
                      >
                        {isFull ? "Full" : "Join"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}