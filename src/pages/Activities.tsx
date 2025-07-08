
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { AddActivityModal } from "@/components/activities/AddActivityModal";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  name: string;
  date: string;
  time?: string;
  campus: "Apple Hill" | "Lakeside";
  participantCount: number;
}

interface ActivitiesProps {
  user: { id: string; username: string } | null;
  onLogout: () => void;
}

export function Activities({ user, onLogout }: ActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('poolup-activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const handleAddActivity = (activityData: { name: string; date: string; campus: string; time: string }) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityData.name,
      date: activityData.date,
      time: activityData.time,
      campus: activityData.campus as "Apple Hill" | "Lakeside",
      participantCount: 1
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem('poolup-activities', JSON.stringify(updatedActivities));
  };

  const handleJoinCarpool = (activityId: string) => {
    navigate(`/scheduler/${activityId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                🚗 PoolUp!
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.username}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Activities</h2>
            <p className="text-muted-foreground mt-1">
              Organize and join carpools for events and activities
            </p>
          </div>
          {activities.length > 0 && <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Activity
          </Button>}
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
              <Plus className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No activities yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get started by creating your first activity. You can organize carpools for events, 
              trips, or any group activities.
            </p>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Activity
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onJoinCarpool={handleJoinCarpool}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Activity Modal */}
      <AddActivityModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddActivity={handleAddActivity}
        existingActivities={activities.map(activity => ({
          name: activity.name,
          date: activity.date,
          campus: activity.campus,
          time: activity.time || ""
        }))}
      />
    </div>
  );
}
