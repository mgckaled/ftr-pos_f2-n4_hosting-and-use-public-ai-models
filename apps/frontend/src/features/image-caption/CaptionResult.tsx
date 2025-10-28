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
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-lg">{caption}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} variant="outline" size="lg" className="w-full rounded-xl font-medium cursor-pointer">
          Generate Another
        </Button>
      </CardFooter>
    </Card>
  );
}
