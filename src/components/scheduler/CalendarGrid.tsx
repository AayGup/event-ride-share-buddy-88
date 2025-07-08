import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: string;
  time: string;
  driverId?: string;
  driverName?: string;
  capacity?: number;
  passengers: string[];
  isAvailable: boolean;
}

interface CalendarGridProps {
  timeSlots: TimeSlot[];
  isDriver: boolean;
  currentUserId: string;
  onSlotSelect: (slotId: string, time: string) => void;
}

export function CalendarGrid({ timeSlots, isDriver, currentUserId, onSlotSelect }: CalendarGridProps) {
  const times = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const getSlotForTime = (time: string) => {
    return timeSlots.find(slot => slot.time === time);
  };

  const canSelectSlot = (time: string) => {
    const slot = getSlotForTime(time);
    
    if (isDriver) {
      // Drivers can always select any slot (allows multiple drivers per time)
      return true;
    } else {
      // Passengers can only select slots with drivers that have space
      return slot && slot.driverId && slot.passengers.length < (slot.capacity || 0);
    }
  };

  const getSlotStatus = (time: string) => {
    const slots = timeSlots.filter(slot => slot.time === time);
    
    if (slots.length === 0) {
      return isDriver ? "available" : "unavailable";
    }
    
    // Check if current user is a driver for this time
    const userSlot = slots.find(slot => slot.driverId === currentUserId);
    if (userSlot) {
      return "own-slot";
    }
    
    // Check if current user is a passenger in any slot for this time
    const joinedSlot = slots.find(slot => slot.passengers.includes(currentUserId));
    if (joinedSlot) {
      return "joined";
    }
    
    // For passengers, check if any slot has space
    if (!isDriver) {
      const availableSlot = slots.find(slot => slot.passengers.length < (slot.capacity || 0));
      return availableSlot ? "available" : "full";
    }
    
    return "available";
  };

  const getSlotVariant = (time: string) => {
    const status = getSlotStatus(time);
    
    switch (status) {
      case "own-slot":
        return "default";
      case "joined":
        return "secondary";
      case "full":
        return "outline";
      case "available":
        return isDriver ? "outline" : "default";
      default:
        return "ghost";
    }
  };

  const getSlotText = (time: string) => {
    const slots = timeSlots.filter(slot => slot.time === time);
    
    if (slots.length === 0) {
      return isDriver ? "Available" : "No drivers";
    }
    
    // Check if current user is a driver for this time
    const userSlot = slots.find(slot => slot.driverId === currentUserId);
    if (userSlot) {
      return `Your slot (${userSlot.passengers.length}/${userSlot.capacity})`;
    }
    
    // Check if current user is a passenger in any slot for this time
    const joinedSlot = slots.find(slot => slot.passengers.includes(currentUserId));
    if (joinedSlot) {
      return `Joined - ${joinedSlot.driverName}`;
    }
    
    // For passengers, show available drivers with locations
    if (!isDriver && slots.length > 0) {
      if (slots.length === 1) {
        const slot = slots[0];
        const available = slot.passengers.length < (slot.capacity || 0);
        return available ? `${slot.driverName} (${slot.passengers.length}/${slot.capacity})` : "Full";
      } else {
        const availableSlots = slots.filter(slot => slot.passengers.length < (slot.capacity || 0));
        return availableSlots.length > 0 ? `${availableSlots.length} drivers available` : "All full";
      }
    }
    
    return slots.length > 0 ? `${slots.length} driver${slots.length > 1 ? 's' : ''}` : "Available";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Available Time Slots</span>
          <Badge variant={isDriver ? "default" : "secondary"}>
            {isDriver ? "Driver Mode" : "Passenger Mode"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {times.map((time) => {
            const canSelect = canSelectSlot(time);
            const status = getSlotStatus(time);
            
            return (
              <Button
                key={time}
                variant={getSlotVariant(time)}
                className={cn(
                  "h-auto p-4 flex flex-col items-start space-y-1",
                  canSelect && "hover:shadow-glow transition-all duration-300",
                  status === "own-slot" && "bg-gradient-primary",
                  status === "joined" && "bg-success",
                  !canSelect && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => canSelect && onSlotSelect(getSlotForTime(time)?.id || `new-${time}`, time)}
                disabled={!canSelect}
              >
                <div className="font-semibold text-sm">{time}</div>
                <div className="text-xs text-left">
                  {getSlotText(time)}
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm">Legend:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {isDriver ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-primary rounded"></div>
                  <span>Your driving slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-border rounded"></div>
                  <span>Available to claim</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span>Joined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span>Available to join</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span>Full</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>No driver</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}