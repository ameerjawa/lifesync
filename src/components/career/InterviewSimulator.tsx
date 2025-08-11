import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';

export function InterviewSimulator() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Tell me about yourself and your experience.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging situation at work and how you handled it.",
    "Why are you interested in this position?"
  ];

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Interview Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Video Preview */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="aspect-video overflow-hidden rounded-lg bg-gray-900">
            {isStarted ? (
              <div className="relative h-full w-full">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted={isMuted}
                  playsInline
                ></video>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700"
                  >
                    {isMuted ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className="rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700"
                  >
                    {isVideoOff ? (
                      <VideoOff className="h-5 w-5" />
                    ) : (
                      <VideoIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <button
                  onClick={() => setIsStarted(true)}
                  className="flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Start Interview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Question and Feedback */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Question</h3>
            <p className="text-gray-700">{questions[currentQuestion]}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Real-time Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-gray-700">Speaking Pace</span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-3/4 bg-green-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-gray-700">Eye Contact</span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-4/5 bg-green-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-gray-700">Clarity</span>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[85%] bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Response Tips</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Use the STAR method for behavioral questions</li>
            <li>• Keep responses concise and focused</li>
            <li>• Provide specific examples</li>
            <li>• Maintain positive body language</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <ThumbsUp className="h-6 w-6 text-green-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Strengths</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Clear communication style</li>
            <li>• Good examples provided</li>
            <li>• Professional appearance</li>
            <li>• Engaging personality</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-lg"
        >
          <div className="flex items-center">
            <RefreshCw className="h-6 w-6 text-orange-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">Areas to Improve</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Reduce filler words</li>
            <li>• Maintain consistent pace</li>
            <li>• More eye contact </li>
            <li>• Expand on achievements</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}