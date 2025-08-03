'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "lucide-react";

export default function ContainerSecurityPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Container className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Container Security</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Container and Kubernetes Security</CardTitle>
          <CardDescription>
            Docker and Kubernetes security assessment tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Container security testing and vulnerability assessment tools will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
