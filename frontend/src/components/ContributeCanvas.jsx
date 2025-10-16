import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contributionAPI } from '../lib/api';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import LoadingSpinner from './LoadingSpinner';

const CONTRIBUTION_TYPES = [
  { id: 'TEXT', label: 'Text', icon: '📝', description: 'Write your thoughts' },
  { id: 'DRAWING', label: 'Drawing', icon: '🎨', description: 'Draw something' },
  { id: 'IMAGE', label: 'Image', icon: '🖼️', description: 'Upload a photo' },
  { id: 'AUDIO', label: 'Audio', icon: '🎙️', description: 'Record a message' },
];

export default function ContributeCanvas({ onBack }) {
  const [selectedType, setSelectedType] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);

  const { 
    isRecording, 
    recordingTime, 
    audioBlob, 
    error: audioError,
    startRecording, 
    stopRecording, 
    resetRecording 
  } = useAudioRecorder();

  // Initialize drawing canvas
  useEffect(() => {
    if (selectedType === 'DRAWING' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 600;
      canvas.height = 600;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctxRef.current = ctx;
    }
  }, [selectedType]);

  // Drawing functions
  const startDrawing = (e) => {
    if (!ctxRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.strokeStyle = brushColor;
    ctxRef.current.lineWidth = brushSize;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    ctxRef.current.fillStyle = '#1a1a1a';
    ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit contribution
  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      let response;

      switch (selectedType) {
        case 'TEXT':
          if (!textContent.trim()) {
            throw new Error('Please enter some text');
          }
          response = await contributionAPI.createText(textContent);
          break;

        case 'DRAWING':
          if (!canvasRef.current) {
            throw new Error('Drawing canvas not initialized');
          }
          const drawingDataUrl = canvasRef.current.toDataURL('image/png');
          response = await contributionAPI.createDrawing(drawingDataUrl);
          break;

        case 'IMAGE':
          if (!imageFile) {
            throw new Error('Please select an image');
          }
          response = await contributionAPI.createImage(imageFile);
          break;

        case 'AUDIO':
          if (!audioBlob) {
            throw new Error('Please record audio');
          }
          response = await contributionAPI.createAudio(audioBlob);
          break;

        default:
          throw new Error('Invalid contribution type');
      }

      setSuccessData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedType(null);
    setTextContent('');
    setImageFile(null);
    setImagePreview(null);
    setSuccessData(null);
    setError(null);
    resetRecording();
  };

  // Success modal
  if (successData) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-12 max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4 text-white">
            Your Monument is Saved!
          </h2>
          
          <p className="text-xl text-gray-300 mb-6">
            Your contribution has been added to the monument
          </p>

          <div className="glass rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-400 mb-2">Your Unique ID:</p>
            <p className="text-3xl font-mono font-bold text-monument-accent">
              {successData.shortId}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Save this ID to find your spot later!
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handleReset} className="btn-secondary">
              Create Another
            </button>
            <button onClick={onBack} className="btn-primary">
              Back to Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Type selection
  if (!selectedType) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 text-white">
              Choose Your Medium
            </h2>
            <p className="text-xl text-gray-400">
              How would you like to contribute to the monument?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {CONTRIBUTION_TYPES.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.id)}
                className="glass rounded-2xl p-8 text-left hover:shadow-2xl hover:shadow-blue-500/20 transition-all"
              >
                <div className="text-6xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {type.label}
                </h3>
                <p className="text-gray-400">{type.description}</p>
              </motion.button>
            ))}
          </div>

          <div className="text-center">
            <button onClick={onBack} className="btn-secondary">
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contribution editors
  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 max-w-3xl w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">
            {CONTRIBUTION_TYPES.find(t => t.id === selectedType)?.label} Contribution
          </h2>
          <button
            onClick={() => setSelectedType(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕ Change Type
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* TEXT EDITOR */}
        {selectedType === 'TEXT' && (
          <div className="space-y-6">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Share your thoughts, memories, or message..."
              maxLength={5000}
              className="w-full h-64 bg-monument-dark border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-monument-accent transition-colors"
            />
            <div className="text-right text-sm text-gray-400">
              {textContent.length} / 5000 characters
            </div>
          </div>
        )}

        {/* DRAWING EDITOR */}
        {selectedType === 'DRAWING' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Color:</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-white text-sm">{brushSize}px</span>
              </div>
              <button
                onClick={clearCanvas}
                className="btn-secondary ml-auto"
              >
                Clear
              </button>
            </div>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-[600px] border border-gray-700 rounded-lg cursor-crosshair"
            />
          </div>
        )}

        {/* IMAGE UPLOADER */}
        {selectedType === 'IMAGE' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-monument-accent transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-96 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="btn-secondary"
                  >
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-gray-400 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* AUDIO RECORDER */}
        {selectedType === 'AUDIO' && (
          <div className="space-y-6">
            {audioError && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{audioError}</p>
              </div>
            )}

            <div className="bg-monument-dark rounded-lg p-8 text-center">
              {!audioBlob ? (
                <>
                  <div className="text-6xl mb-4">
                    {isRecording ? '🔴' : '🎙️'}
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">
                    {isRecording ? 'Recording...' : 'Ready to Record'}
                  </p>
                  <p className="text-gray-400 mb-6">
                    {isRecording 
                      ? `${recordingTime}s / 60s` 
                      : 'Maximum 60 seconds'}
                  </p>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? 'btn-secondary' : 'btn-primary'}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-2xl font-bold text-white mb-2">
                    Recording Complete
                  </p>
                  <audio
                    src={URL.createObjectURL(audioBlob)}
                    controls
                    className="w-full mb-6"
                  />
                  <button
                    onClick={resetRecording}
                    className="btn-secondary"
                  >
                    🔄 Record Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SUBMIT BUTTONS */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setSelectedType(null)}
            className="btn-secondary flex-1"
            disabled={isSubmitting}
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || 
              (selectedType === 'TEXT' && !textContent.trim()) ||
              (selectedType === 'IMAGE' && !imageFile) ||
              (selectedType === 'AUDIO' && !audioBlob)
            }
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit My Monument'}
          </button>
        </div>
      </motion.div>

      {isSubmitting && <LoadingSpinner message="Creating your monument..." />}
    </div>
  );
} 