import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageCaptionFormProps {
  onSubmit: (imageUrl: string) => void;
  isLoading: boolean;
}

export function ImageCaptionForm({ onSubmit, isLoading }: ImageCaptionFormProps) {
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSubmit(imageUrl.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate Image Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !imageUrl.trim()} className="w-full">
            {isLoading ? 'Generating...' : 'Generate Caption'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
