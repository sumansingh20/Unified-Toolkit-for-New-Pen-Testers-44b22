'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

export default function MobileSecurityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Smartphone className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Mobile Security</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Mobile Security Testing</CardTitle>
          <CardDescription>
            Tools and techniques for mobile application security assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Mobile security testing tools and methodologies will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
