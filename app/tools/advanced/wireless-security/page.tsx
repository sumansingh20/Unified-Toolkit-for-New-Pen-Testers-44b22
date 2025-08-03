'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";

export default function WirelessSecurityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Wifi className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Wireless Security</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Wireless Security Testing</CardTitle>
          <CardDescription>
            WiFi and wireless network security assessment tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Wireless security testing tools and methodologies will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
