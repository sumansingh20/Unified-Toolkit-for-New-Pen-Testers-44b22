'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function OSINTToolkitPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">OSINT Toolkit</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Open Source Intelligence</CardTitle>
          <CardDescription>
            Gather intelligence from publicly available sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>OSINT tools and techniques will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
