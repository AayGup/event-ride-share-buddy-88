import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus, X } from "lucide-react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function LocationInput({ value, onChange, placeholder, label }: LocationInputProps) {
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const predefinedLocations = [
    "Apple Hill Campus",
    "Lakeside Campus", 
  ];

  const handlePredefinedSelect = (location: string) => {
    onChange(location);
  };

  const handleCustomAdd = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      setCustomInput("");
      setIsCustomLocation(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      {/* Current Selection */}
      {value && (
        <div className="flex items-center gap-2 p-2 bg-success/10 rounded-lg border border-success/20">
          <MapPin className="h-4 w-4 text-success" />
          <span className="text-sm text-black">{value}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-1 ml-auto"
            onClick={() => onChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Selection Options */}
      {!value && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Quick Select:</div>
              <div className="grid grid-cols-1 gap-2">
                {predefinedLocations.map((location) => (
                  <Button
                    key={location}
                    type="button"
                    variant="outline"
                    className="justify-start h-auto p-3 text-left hover:shadow-glow transition-all duration-300"
                    onClick={() => handlePredefinedSelect(location)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {location}
                  </Button>
                ))}
              </div>
              
              <div className="border-t pt-3">
                {!isCustomLocation ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsCustomLocation(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add custom location
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder={placeholder || "Enter custom location or address"}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCustomAdd();
                        }
                        if (e.key === 'Escape') {
                          setIsCustomLocation(false);
                          setCustomInput("");
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCustomAdd}
                        disabled={!customInput.trim()}
                      >
                        Add Location
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsCustomLocation(false);
                          setCustomInput("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
