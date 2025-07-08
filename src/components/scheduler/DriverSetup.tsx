import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MapPin, FileText } from "lucide-react";
import { LocationInput } from "../activities/LocationInput";

interface DriverSetupProps {
  onCreateSlot: (data: {
    time: string;
    location: string;
    note: string;
    capacity: number;
  }) => void;
  onCancel: () => void;
}

export function DriverSetup({ onCreateSlot, onCancel }: DriverSetupProps) {
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [capacity, setCapacity] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time || !location) return;
    
    onCreateSlot({
      time,
      location,
      note,
      capacity
    });
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle>Set Your Driver Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departure-time">Departure Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="departure-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <LocationInput
            value={location}
            onChange={setLocation}
            label="Departure Location"
            placeholder="Where will you pick up passengers?"
          />

          <div className="space-y-2">
            <Label htmlFor="capacity">Number of Passengers</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="8"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Additional Notes (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Meet at the main entrance, Look for blue car..."
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit"
              className="bg-gradient-primary flex-1"
              disabled={!time || !location}
            >
              Create Driver Slot
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}