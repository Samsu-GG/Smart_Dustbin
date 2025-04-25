"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from 'lucide-react';

const MAX_BIN_HEIGHT = 50; // cm

export default function Home() {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [distance, setDistance] = useState(0);

  // Simulate data reception from ESP32 (replace with actual data fetching)
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random distance between 0 and MAX_BIN_HEIGHT
      const randomDistance = Math.random() * MAX_BIN_HEIGHT;
      setDistance(randomDistance);

      // Calculate fill percentage
      const newFillPercentage = Math.max(0, Math.min(100, ((MAX_BIN_HEIGHT - randomDistance) / MAX_BIN_HEIGHT) * 100));
      setFillPercentage(newFillPercentage);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getProgressColor = () => {
    if (fillPercentage < 30) {
      return "var(--binsight-green)";
    } else if (fillPercentage < 70) {
      return "var(--binsight-yellow)";
    } else {
      return "var(--binsight-red)";
    }
  };

  const progressColor = getProgressColor();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md rounded-lg shadow-md border-2 border-muted">
        <CardHeader className="flex flex-row items-center pb-2 space-y-0">
          <Trash2 className="w-10 h-10 mr-2 text-muted-foreground" />
          <CardTitle className="text-2xl font-bold tracking-tight">BinSight</CardTitle>
          <CardDescription>Smart Dustbin Monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <div className="text-lg font-semibold">Fill Percentage</div>
              <div className="text-5xl font-bold tracking-tight">{fillPercentage.toFixed(1)}%</div>
            </div>
            <div>
              <Progress value={fillPercentage} className="h-6" style={{ "--progress-color": progressColor }} />
            </div>
            <div className="text-sm text-muted-foreground">
              Distance from top: {distance.toFixed(2)} cm
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
