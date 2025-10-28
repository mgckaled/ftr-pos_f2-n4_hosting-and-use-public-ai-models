import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';

interface ImageCaptionFormProps {
  onSubmit: (imageUrl: string) => void;
  isLoading: boolean;
}

export function ImageCaptionForm({ onSubmit, isLoading }: ImageCaptionFormProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      setImageUrl(''); // Clear URL input
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    // Clear file if URL is entered
    if (e.target.value && selectedFile) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (previewUrl) {
      onSubmit(previewUrl);
    } else if (imageUrl.trim()) {
      onSubmit(imageUrl.trim());
    }
  };

  const hasImage = imageUrl.trim() || previewUrl;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate Image Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageFile" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </Label>
            <input
              ref={fileInputRef}
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full rounded-xl font-medium cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {selectedFile ? selectedFile.name : 'Choose file...'}
            </Button>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="rounded-lg border overflow-hidden">
              <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !hasImage}
            size="lg"
            className="w-full rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            {isLoading ? 'Generating...' : 'Generate Caption'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
