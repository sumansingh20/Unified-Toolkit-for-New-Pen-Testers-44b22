'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CryptographyPage() {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [method, setMethod] = useState('caesar');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const encrypt = () => {
    if (!plaintext) return;
    
    switch (method) {
      case 'caesar': {
        const shift = parseInt(key) || 3;
        const encrypted = plaintext.split('').map(char => {
          if (/[a-z]/i.test(char)) {
            const base = char >= 'a' ? 97 : 65;
            return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
          }
          return char;
        }).join('');
        setCiphertext(encrypted);
        break;
      }
        
      case 'base64':
        setCiphertext(btoa(plaintext));
        break;
        
      case 'reverse':
        setCiphertext(plaintext.split('').reverse().join(''));
        break;
        
      default:
        setCiphertext('Method not implemented');
    }
  };

  const decrypt = () => {
    if (!ciphertext) return;
    
    switch (method) {
      case 'caesar': {
        const shift = -(parseInt(key) || 3);
        const decrypted = ciphertext.split('').map(char => {
          if (/[a-z]/i.test(char)) {
            const base = char >= 'a' ? 97 : 65;
            return String.fromCharCode((char.charCodeAt(0) - base + shift + 26) % 26 + base);
          }
          return char;
        }).join('');
        setPlaintext(decrypted);
        break;
      }
        
      case 'base64':
        try {
          setPlaintext(atob(ciphertext));
        } catch {
          setPlaintext('Invalid Base64');
        }
        break;
        
      case 'reverse':
        setPlaintext(ciphertext.split('').reverse().join(''));
        break;
        
      default:
        setPlaintext('Method not implemented');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Cryptography Tools</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Encryption/Decryption
            </CardTitle>
            <CardDescription>
              Encrypt and decrypt text using various cryptographic methods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="method">Cryptographic Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caesar">Caesar Cipher</SelectItem>
                  <SelectItem value="base64">Base64 Encoding</SelectItem>
                  <SelectItem value="reverse">Reverse Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {method === 'caesar' && (
              <div>
                <Label htmlFor="key">Shift Key</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter shift value (e.g., 3)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="plaintext">Plaintext</Label>
              <Textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter text to encrypt"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="ciphertext">Ciphertext</Label>
              <Textarea
                value={ciphertext}
                onChange={(e) => setCiphertext(e.target.value)}
                placeholder="Enter text to decrypt"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={encrypt} className="flex-1">
                <Lock className="h-4 w-4 mr-2" />
                Encrypt
              </Button>
              <Button onClick={decrypt} variant="outline" className="flex-1">
                <Key className="h-4 w-4 mr-2" />
                Decrypt
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Cryptographic Techniques</CardTitle>
            <CardDescription>
              Overview of encryption methods and their uses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Caesar Cipher</h4>
                <p className="text-sm text-muted-foreground">
                  Simple substitution cipher where each letter is shifted by a fixed number
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Base64 Encoding</h4>
                <p className="text-sm text-muted-foreground">
                  Binary-to-text encoding scheme commonly used in web applications
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Best Practices</h4>
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Use strong, randomly generated keys</li>
                  <li>Never hardcode encryption keys</li>
                  <li>Use established cryptographic libraries</li>
                  <li>Implement proper key management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
