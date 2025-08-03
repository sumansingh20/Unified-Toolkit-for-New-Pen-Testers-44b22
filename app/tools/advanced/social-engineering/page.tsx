'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function SocialEngineeringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Social Engineering</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Social Engineering Testing</CardTitle>
          <CardDescription>
            Human-based security testing and awareness tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Social engineering testing tools and educational resources will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
