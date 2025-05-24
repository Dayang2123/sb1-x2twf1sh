import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Search, X, ImagePlus, Download } from 'lucide-react';
import { generateImagesFromAI, AIConfig } from '../../services/aiService';

interface ImageGalleryProps {
  onClose: () => void;
  onSelectImage: (url: string, alt: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ onClose, onSelectImage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'stock' | 'generated' | 'upload'>('stock');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null); // For AI generation errors
  const [uploadError, setUploadError] = useState<string | null>(null); // For upload errors
  const [uploadedImages, setUploadedImages] = useState<{ url: string; alt: string; file?: File }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);


  const mockAiConfig: AIConfig = {
    model: 'mock-image-gen-001',
    apiKey: 'mock-api-key-image-12345',
  };

  // Mock data for stock images
  const stockImages = [
    {
      id: 's1',
      url: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg',
      alt: 'Person typing on laptop with coffee',
      category: 'productivity'
    },
    {
      id: 's2',
      url: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg',
      alt: 'Clock and calendar on desk',
      category: 'time management'
    },
    {
      id: 's3',
      url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
      alt: 'Blue and purple lights representing technology',
      category: 'technology'
    },
    {
      id: 's4',
      url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
      alt: 'Team collaborating on project',
      category: 'teamwork'
    },
    {
      id: 's5',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      alt: 'People discussing ideas on whiteboard',
      category: 'innovation'
    },
    {
      id: 's6',
      url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      alt: 'Planning session with sticky notes',
      category: 'planning'
    }
  ];

  const filteredStockImages = searchQuery
    ? stockImages.filter(img => 
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stockImages;

  const handleGenerateImages = async () => {
    if (!generationPrompt) return;

    setIsGenerating(true);
    setGeneratedImages([]);
    setErrorState(null);

    try {
      const imageUrls = await generateImagesFromAI(generationPrompt, mockAiConfig);
      setGeneratedImages(imageUrls);
    } catch (error) {
      if (error instanceof Error) {
        setErrorState(error.message);
      } else {
        setErrorState('An unknown error occurred during AI image generation.');
      }
      console.error("Error generating AI images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newImagesPromises = Array.from(files).map(file => {
      return new Promise<{ url: string; alt: string; file: File } | null>((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          // Optional: Skip non-image files or handle error
          console.warn(`Skipping non-image file: ${file.name}`);
          resolve(null); // Resolve with null to filter out later
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            alt: file.name,
            file: file,
          });
        };
        reader.onerror = () => {
          console.error(`Error reading file: ${file.name}`);
          reject(`Error reading file: ${file.name}`); 
        }
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises)
      .then(newImagesData => {
        const validNewImages = newImagesData.filter(img => img !== null) as { url: string; alt: string; file: File }[];
        if (validNewImages.length > 0) {
          setUploadedImages(prevImages => [...prevImages, ...validNewImages]);
        }
        if (validNewImages.length !== files.length) {
          setUploadError("Some files were not valid images and were skipped.");
        }
      })
      .catch(error => {
        setUploadError(error || "An error occurred during file processing.");
      });
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
    // Clear the file input's value to allow uploading the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
    processFiles(event.dataTransfer.files);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col animate-slide-up">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800">Image Gallery</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'stock'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              Stock Images
            </button>
            <button
              onClick={() => setActiveTab('generated')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'generated'
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ml-2`}
            >
              AI Generated
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'upload'
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ml-2`}
            >
              Upload
            </button>
          </div>

          {activeTab === 'stock' && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2" />
            </div>
          )}

          {activeTab === 'generated' && (
            <div className="flex">
              <input
                type="text"
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm focus:ring-secondary-500 focus:border-secondary-500"
              />
              <button
                onClick={handleGenerateImages}
                disabled={!generationPrompt || isGenerating}
                className={`px-4 py-2 rounded-r-md text-sm font-medium ${
                  !generationPrompt || isGenerating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-secondary-600 text-white hover:bg-secondary-700'
                } transition-colors`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-1"></div>
                    Generating...
                  </>
                ) : 'Generate'}
              </button>
            </div>
          )}

          {activeTab === 'upload' && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
                isDraggingOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <ImagePlus className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Drag and drop images here, or click to select files.
              </p>
              <button 
                onClick={handleUploadButtonClick}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Select Images
              </button>
              {uploadError && (
                <p className="text-red-500 text-sm mt-2">{uploadError}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'stock' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredStockImages.map(image => (
                <div 
                  key={image.id}
                  onClick={() => onSelectImage(image.url, image.alt)}
                  className="relative overflow-hidden rounded-md border border-gray-200 cursor-pointer group"
                >
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                    <span className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select Image
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs truncate">
                    {image.alt}
                  </div>
                </div>
              ))}
              
              {filteredStockImages.length === 0 && (
                <div className="col-span-3 py-12 text-center text-gray-500">
                  <p>No images found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'generated' && (
            <>
              {isGenerating ? (
                <div className="py-16 text-center">
                  <div className="inline-block animate-pulse-slow p-4 rounded-full bg-secondary-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary-200 border-t-secondary-600"></div>
                  </div>
                  <p className="mt-4 text-secondary-600 font-medium">Generating your images...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedImages.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectImage(url, `AI generated image based on prompt: ${generationPrompt}`)}
                      className="relative overflow-hidden rounded-md border border-gray-200 cursor-pointer group"
                    >
                      <img
                        src={url}
                        alt={`AI generated image ${index + 1} from prompt "${generationPrompt}"`}
                        className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                        <span className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Select Image
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs">
                        Generated Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : errorState ? (
                <div className="py-12 text-center text-red-600 bg-red-50 p-4 rounded-md">
                  <p className="font-medium">Image Generation Failed</p>
                  <p className="text-sm">{errorState}</p>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <p>Enter a prompt and click "Generate" to create AI images.</p>
                  <p className="text-sm">Example: "A futuristic cityscape at sunset"</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'upload' && (
            <>
              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => onSelectImage(image.url, image.alt)}
                      className="relative overflow-hidden rounded-md border border-gray-200 cursor-pointer group"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                        <span className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Select Image
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs truncate" title={image.alt}>
                        {image.alt}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <p>No images uploaded yet. Click 'Select Images' or drag and drop to start.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;