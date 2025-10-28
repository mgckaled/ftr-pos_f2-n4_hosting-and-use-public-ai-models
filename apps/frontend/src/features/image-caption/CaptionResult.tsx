import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CaptionResultProps {
  caption: string;
  onReset: () => void;
}

export function CaptionResult({ caption, onReset }: CaptionResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Generated Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg">{caption}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleCopy} variant="secondary" size="lg" className="flex-1 rounded-xl font-medium cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Caption
            </>
          )}
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="flex-1 rounded-xl font-medium cursor-pointer">
          Generate Another
        </Button>
      </CardFooter>
    </Card>
  );
}
