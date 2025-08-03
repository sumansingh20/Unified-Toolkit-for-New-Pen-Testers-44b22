'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, Search, List, Target } from "lucide-react";
import { useState } from "react";

export default function DirectoryBusterPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [wordlist, setWordlist] = useState('common');
  const [results, setResults] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    if (!targetUrl) return;
    
    setIsScanning(true);
    setResults('Starting directory enumeration...\n');
    
    // Simulate directory busting
    setTimeout(() => {
      const simulatedResults = [
        '200 - /admin/',
        '200 - /backup/',
        '403 - /config/',
        '200 - /images/',
        '404 - /test/',
        '200 - /uploads/',
        '301 - /api/ -> /api/v1/',
        '200 - /docs/',
      ];
      
      setResults(prev => prev + simulatedResults.join('\n') + '\n\nScan completed.');
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Directory Buster</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Directory Enumeration
            </CardTitle>
            <CardDescription>
              Discover hidden directories and files on web servers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target-url">Target URL</Label>
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="wordlist">Wordlist</Label>
              <Select value={wordlist} onValueChange={setWordlist}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wordlist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common Directories</SelectItem>
                  <SelectItem value="admin">Admin Paths</SelectItem>
                  <SelectItem value="backup">Backup Files</SelectItem>
                  <SelectItem value="api">API Endpoints</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={startScan} 
              disabled={isScanning || !targetUrl}
              className="w-full"
            >
              <Target className="h-4 w-4 mr-2" />
              {isScanning ? 'Scanning...' : 'Start Directory Scan'}
            </Button>
            
            {results && (
              <div>
                <Label htmlFor="results">Scan Results</Label>
                <Textarea
                  value={results}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Common Directories
            </CardTitle>
            <CardDescription>
              Frequently found directories and their purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">/admin/</h4>
                <p className="text-sm text-muted-foreground">Administrative interfaces</p>
              </div>
              
              <div>
                <h4 className="font-semibold">/backup/</h4>
                <p className="text-sm text-muted-foreground">Backup files and archives</p>
              </div>
              
              <div>
                <h4 className="font-semibold">/config/</h4>
                <p className="text-sm text-muted-foreground">Configuration files</p>
              </div>
              
              <div>
                <h4 className="font-semibold">/api/</h4>
                <p className="text-sm text-muted-foreground">API endpoints</p>
              </div>
              
              <div>
                <h4 className="font-semibold">/uploads/</h4>
                <p className="text-sm text-muted-foreground">User uploaded files</p>
              </div>
              
              <div>
                <h4 className="font-semibold">/test/</h4>
                <p className="text-sm text-muted-foreground">Testing environments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
