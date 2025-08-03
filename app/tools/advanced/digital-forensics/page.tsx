'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Database, FileText, Shield } from "lucide-react";
import { useState } from "react";

export default function DigitalForensicsPage() {
  const [targetFile, setTargetFile] = useState('');
  const [metadata, setMetadata] = useState('');
  const [hashValue, setHashValue] = useState('');

  const analyzeFile = () => {
    if (!targetFile) return;
    
    // Simulate metadata extraction
    const simulatedMetadata = {
      fileName: targetFile,
      fileSize: "2.3 MB",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      hash: "sha256:a1b2c3d4e5f6..."
    };
    
    setMetadata(JSON.stringify(simulatedMetadata, null, 2));
    setHashValue(simulatedMetadata.hash);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Digital Forensics</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              File Analysis
            </CardTitle>
            <CardDescription>
              Analyze files for metadata and digital evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-file">Target File Path</Label>
              <Input
                value={targetFile}
                onChange={(e) => setTargetFile(e.target.value)}
                placeholder="Enter file path to analyze"
              />
            </div>
            
            <Button onClick={analyzeFile} className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Analyze File
            </Button>
            
            {metadata && (
              <div>
                <Label htmlFor="metadata">File Metadata</Label>
                <Textarea
                  value={metadata}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            )}
            
            {hashValue && (
              <div>
                <Label htmlFor="hash">File Hash</Label>
                <Input
                  value={hashValue}
                  readOnly
                  className="font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Forensics Tools
            </CardTitle>
            <CardDescription>
              Digital forensics techniques and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Evidence Preservation</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain chain of custody and create forensic images
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Metadata Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Extract hidden information from file properties
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Hash Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Verify file integrity using cryptographic hashes
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Timeline Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Reconstruct sequence of events from digital artifacts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
