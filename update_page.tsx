"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from 'lucide-react';

const MAX_BIN_HEIGHT = 50; // cm

export default function Home() {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/bin-data/list/', { // Replace with your Django backend URL
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns a list of bin data, get the latest entry
          if (data && data.length > 0) {
            const latestData = data[data.length - 1];
            setDistance(latestData.distance);

            // Calculate fill percentage
            const newFillPercentage = Math.max(0, Math.min(100, ((MAX_BIN_HEIGHT - latestData.distance) / MAX_BIN_HEIGHT) * 100));
            setFillPercentage(newFillPercentage);
          }
        } else {
          console.error('Failed to fetch bin data');
        }
      } catch (error) {
        console.error('Error fetching bin data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data periodically (e.g., every 5 seconds)
    const intervalId = setInterval(fetchData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
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
              Distance from top: {distance !== null ? distance.toFixed(2) : 'Loading...'} cm
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
