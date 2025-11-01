import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  stage: string;
}

export function ProgressIndicator({ progress, stage }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl space-y-4 p-6 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-base font-medium">{stage}</p>
      </div>

      {progress > 0 && <Progress value={progress} className="h-2" />}
    </div>
  );
}
