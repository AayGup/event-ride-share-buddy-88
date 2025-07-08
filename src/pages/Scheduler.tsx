import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Users, AlertTriangle } from "lucide-react";
import { DriverSetup } from "@/components/scheduler/DriverSetup";
import { DriverList } from "@/components/scheduler/DriverList";
import { useToast } from "@/hooks/use-toast";

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

interface SchedulerProps {
  user: { id: string; email: string } | null;
}

export function Scheduler({ user }: SchedulerProps) {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isDriver, setIsDriver] = useState<boolean | null>(null);
  const [driverSlots, setDriverSlots] = useState<DriverSlot[]>(() => {
    const saved = localStorage.getItem(`poolup-scheduler-${activityId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showDriverSetup, setShowDriverSetup] = useState(false);

  // Check if user is already signed up and set their role automatically
  useEffect(() => {
    if (!user) return;

    // Check if user is already a driver
    const userDriverSlots = driverSlots.filter(slot => slot.driverId === user.id);
    if (userDriverSlots.length > 0) {
      setIsDriver(true);
      return;
    }

    // Check if user is already a passenger
    const userPassengerSlots = driverSlots.filter(slot => slot.passengers.includes(user.id));
    if (userPassengerSlots.length > 0) {
      setIsDriver(false);
      return;
    }

    // If not signed up, keep isDriver as null to show role selection
  }, [user, driverSlots]);

  // Get activity data from localStorage
  const getActivityData = () => {
    const saved = localStorage.getItem('poolup-activities');
    if (saved) {
      const activities = JSON.parse(saved);
      return activities.find((act: any) => act.id === activityId);
    }
    return null;
  };

  const activity = getActivityData() || {
    id: activityId,
    name: "Unknown Activity",
    date: new Date().toISOString().split('T')[0],
    time: "",
    campus: "Unknown Location"
  };

  const handleRoleSelection = (selectedRole: "driver" | "passenger") => {
    setIsDriver(selectedRole === "driver");
    if (selectedRole === "driver") {
      setShowDriverSetup(true);
    }
  };

  const handleCreateDriverSlot = (data: {
    time: string;
    location: string;
    note: string;
    capacity: number;
  }) => {
    if (!user) return;

    const newSlot: DriverSlot = {
      id: `slot-${Date.now()}`,
      time: data.time,
      driverId: user.id,
      driverName: user.email.split('@')[0],
      location: data.location,
      note: data.note,
      capacity: data.capacity,
      passengers: []
    };

    const updatedSlots = [...driverSlots, newSlot];
    setDriverSlots(updatedSlots);
    localStorage.setItem(`poolup-scheduler-${activityId}`, JSON.stringify(updatedSlots));
    setShowDriverSetup(false);
    
    toast({
      title: "Driver slot created!",
      description: `You're now driving from ${data.location} at ${data.time} with ${data.capacity} passenger spots`,
    });
  };

  const handleCancelDriverSlot = (slotId: string) => {
    if (!user) return;

    const slot = driverSlots.find(s => s.id === slotId);
    if (!slot) return;

    // Remove the driver slot entirely
    const updatedSlots = driverSlots.filter(s => s.id !== slotId);
    setDriverSlots(updatedSlots);
    localStorage.setItem(`poolup-scheduler-${activityId}`, JSON.stringify(updatedSlots));
    
    toast({
      title: "Driver slot cancelled",
      description: `Your driving slot from ${slot.location} at ${slot.time} has been cancelled`,
      variant: "destructive"
    });

    // If this was the user's only driving slot, reset their role selection
    const remainingUserSlots = updatedSlots.filter(s => s.driverId === user.id);
    if (remainingUserSlots.length === 0) {
      setIsDriver(null);
    }
  };

  const handleJoinDriver = (slotId: string) => {
    if (!user) return;

    const updatedSlots = driverSlots.map(slot => 
      slot.id === slotId 
        ? { ...slot, passengers: [...slot.passengers, user.id] }
        : slot
    );
    setDriverSlots(updatedSlots);
    localStorage.setItem(`poolup-scheduler-${activityId}`, JSON.stringify(updatedSlots));
    
    const slot = driverSlots.find(s => s.id === slotId);
    if (slot) {
      toast({
        title: "Joined carpool!",
        description: `You've joined ${slot.driverName}'s carpool from ${slot.location} at ${slot.time}`,
      });
    }
  };

  const handleLeaveDriver = (slotId: string) => {
    if (!user) return;

    const updatedSlots = driverSlots.map(slot => 
      slot.id === slotId 
        ? { ...slot, passengers: slot.passengers.filter(id => id !== user.id) }
        : slot
    );
    setDriverSlots(updatedSlots);
    localStorage.setItem(`poolup-scheduler-${activityId}`, JSON.stringify(updatedSlots));
    
    toast({
      title: "Left carpool",
      description: "You've left the carpool",
    });

    // Reset role selection if user leaves all carpools
    const remainingPassengerSlots = updatedSlots.filter(slot => slot.passengers.includes(user.id));
    if (remainingPassengerSlots.length === 0) {
      setIsDriver(null);
    }
  };

  const getUserPassengerSlots = () => {
    if (!user) return [];
    return driverSlots.filter(slot => slot.passengers.includes(user.id));
  };

  const getUserDriverSlots = () => {
    if (!user) return [];
    return driverSlots.filter(slot => slot.driverId === user.id);
  };

  const getPassengerName = (passengerId: string) => {
    // In a real app, you'd fetch user data. For now, we'll use the email prefix
    return `passenger-${passengerId.slice(-4)}`;
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/activities')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Activities
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{activity.name}</h1>
              <p className="text-sm text-muted-foreground">
                {new Date(activity.date).toLocaleDateString()}
                {activity.time && ` • ${activity.time}`} • {activity.campus}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Role Selection - only show if user hasn't signed up yet */}
        {isDriver === null && (
          <Card className="mb-8 shadow-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Choose Your Role</CardTitle>
              <CardDescription>
                Are you planning to drive or looking for a ride?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:shadow-glow transition-all duration-300"
                  onClick={() => handleRoleSelection("driver")}
                >
                  <Car className="h-8 w-8 text-primary" />
                  <span className="font-semibold">I'm a Driver</span>
                  <span className="text-xs text-muted-foreground">
                    I can offer rides to others
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:shadow-glow transition-all duration-300"
                  onClick={() => handleRoleSelection("passenger")}
                >
                  <Users className="h-8 w-8 text-primary" />
                  <span className="font-semibold">I'm a Passenger</span>
                  <span className="text-xs text-muted-foreground">
                    I need a ride to the event
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Driver Setup */}
        {showDriverSetup && (
          <DriverSetup
            onCreateSlot={handleCreateDriverSlot}
            onCancel={() => setShowDriverSetup(false)}
          />
        )}

        {/* Driver List for Passengers */}
        {isDriver === false && !showDriverSetup && (
          <DriverList
            drivers={driverSlots}
            currentUserId={user.id}
            onJoinDriver={handleJoinDriver}
            onLeaveDriver={handleLeaveDriver}
          />
        )}

        {/* Current Status */}
        {isDriver !== null && !showDriverSetup && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Your Status
                <Badge variant={isDriver ? "default" : "secondary"}>
                  {isDriver ? "Driver" : "Passenger"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isDriver ? (
                <div>
                  {getUserDriverSlots().length === 0 ? (
                    <div className="text-center py-6">
                      <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">
                        You haven't set up any driver slots yet.
                      </p>
                      <Button 
                        onClick={() => setShowDriverSetup(true)}
                        className="bg-gradient-primary"
                      >
                        Set Up Driver Details
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getUserDriverSlots().map(slot => (
                        <div key={slot.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">Driving from {slot.location}</h4>
                              <p className="text-sm text-muted-foreground">Departure: {slot.time}</p>
                              {slot.note && (
                                <p className="text-sm text-muted-foreground mt-1">Note: {slot.note}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {slot.passengers.length}/{slot.capacity} passengers
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelDriverSlot(slot.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                          
                          {slot.passengers.length > 0 ? (
                            <div className="bg-muted/50 rounded p-3">
                              <h5 className="font-medium text-sm mb-2">Your Passengers:</h5>
                              <div className="flex flex-wrap gap-2">
                                {slot.passengers.map(passengerId => (
                                  <Badge key={passengerId} variant="secondary">
                                    {getPassengerName(passengerId)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-muted/50 rounded p-3 text-center">
                              <p className="text-sm text-muted-foreground">
                                No passengers yet - waiting for riders to join
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {getUserPassengerSlots().length === 0 ? (
                    <p className="text-muted-foreground">
                      Choose a driver from the list above to join a carpool.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {getUserPassengerSlots().map(slot => (
                        <div key={slot.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">Riding with {slot.driverName}</h4>
                              <p className="text-sm text-muted-foreground">
                                From {slot.location} at {slot.time}
                              </p>
                              {slot.note && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Driver's note: {slot.note}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Confirmed</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleLeaveDriver(slot.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Leave
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-muted/50 rounded p-3">
                            <h5 className="font-medium text-sm mb-2">Other Passengers:</h5>
                            {slot.passengers.filter(id => id !== user.id).length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {slot.passengers
                                  .filter(id => id !== user.id)
                                  .map(passengerId => (
                                    <Badge key={passengerId} variant="secondary">
                                      {getPassengerName(passengerId)}
                                    </Badge>
                                  ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                You're the only passenger so far
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
