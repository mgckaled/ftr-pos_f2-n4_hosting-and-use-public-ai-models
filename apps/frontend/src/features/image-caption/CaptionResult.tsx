import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptionResultProps {
  caption: string;
  onReset: () => void;
}

export function CaptionResult({ caption, onReset }: CaptionResultProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generated Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{caption}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} variant="outline" className="w-full">
          Generate Another
        </Button>
      </CardFooter>
    </Card>
  );
}
