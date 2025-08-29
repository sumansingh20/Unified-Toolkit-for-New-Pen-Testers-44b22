'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function BurpSuitePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Burp Suite</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Web Application Security Testing</CardTitle>
          <CardDescription>
            Professional web application security testing platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Burp Suite integration and advanced web security testing tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
