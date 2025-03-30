import { useState } from "react";
import { mockGalleryData } from "../../mock/gallery";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

export default function GallerySection() {
  const [galleryItems, setGalleryItems] = useState(mockGalleryData);
  const isLoading = false;
  const error = null;

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-20 bg-[#F8F8F8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Experience Elysian
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Take a visual journey through our exquisite spaces and experiences.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <GalleryItemSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load gallery. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems?.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white text-primary p-3 rounded-full">
                        <Search className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-4xl overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GalleryItemSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="w-full h-64 bg-neutral-200 animate-pulse" />
    </div>
  );
}
