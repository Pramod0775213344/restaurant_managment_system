import { useState, type FormEvent } from "react";
import { Search, Sparkles, Loader2, X, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashImagePickerProps {
  initialQuery?: string;
  currentImageUrl?: string | null;
  onSelectImage: (imageUrl: string) => void;
}

export default function UnsplashImagePicker({
  initialQuery = "",
  currentImageUrl,
  onSelectImage,
}: UnsplashImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery || "delicious food");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessKey =
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY ||
    "0HBH14qJs-sQM22Cc-eXM4mBP8eCiGhciGLkgZIWBfQ";

  const searchPhotos = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&per_page=16&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to search Unsplash");
      }

      const data = await res.json();
      setPhotos(data.results || []);
    } catch {
      setError("Failed to load photos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    const q = initialQuery.trim() || "delicious food";
    setQuery(q);
    setIsOpen(true);
    searchPhotos(q);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    searchPhotos(query);
  };

  const handleSelect = (photo: UnsplashPhoto) => {
    // Optimized web-ready image with Unsplash parameters
    const optimizedUrl = `${photo.urls.raw}&w=600&auto=format&fit=crop&q=80`;
    onSelectImage(optimizedUrl);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Current Preview or Trigger */}
      <div className="flex items-center gap-3">
        {currentImageUrl ? (
          <div className="relative group size-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-muted shadow-2xs">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onSelectImage("")}
                className="text-white hover:text-rose-300 transition-colors"
                title="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="size-16 shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-muted-foreground">
            <ImageIcon className="size-6 text-gray-400" />
          </div>
        )}

        <div className="flex-1 space-y-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleOpen}
            className="rounded-lg h-9 text-xs font-medium bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-900 hover:bg-purple-100"
          >
            <Sparkles className="size-3.5 mr-1.5 text-purple-600" />
            {currentImageUrl ? "Change Photo with Unsplash" : "Pick from Unsplash"}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Connect high-resolution food images instantly
          </p>
        </div>
      </div>

      {/* Nested Slide-Over Drawer for Unsplash Search */}
      <Drawer open={isOpen} onOpenChange={setIsOpen} swipeDirection="right">
        <DrawerContent className="sm:max-w-md w-full">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-purple-600" />
              Search Unsplash Photos
            </DrawerTitle>
            <DrawerDescription>
              Select a professional food photo for your menu item.
            </DrawerDescription>
          </DrawerHeader>

          {/* Search Form inside drawer */}
          <div className="px-4 pb-3 pt-1 border-b">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. burger, pizza, cocktail, cake..."
                  className="pl-9 h-10 rounded-lg text-sm bg-gray-50 border-gray-200"
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={isLoading} className="rounded-lg h-10 px-4">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </div>

          {/* Scrollable Photo Results */}
          <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-lg bg-gray-100 animate-pulse border"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center text-rose-500 text-sm">
                {error}
              </div>
            ) : photos.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                No food photos found for "{query}". Try a different keyword!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => {
                  const isSelected = currentImageUrl?.includes(photo.id);

                  return (
                    <div
                      key={photo.id}
                      onClick={() => handleSelect(photo)}
                      className={`group relative h-32 rounded-lg overflow-hidden border border-gray-200 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${isSelected ? "ring-2 ring-purple-600 border-purple-600" : ""
                        }`}
                    >
                      <img
                        src={photo.urls.small}
                        alt={photo.alt_description || "Food"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <p className="text-[10px] text-white truncate font-medium">
                          Photo by {photo.user.name}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 size-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                          <Check className="size-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t p-3 bg-gray-50/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Powered by Unsplash</span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-7 text-xs rounded-md"
            >
              Cancel
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
