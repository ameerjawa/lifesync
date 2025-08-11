import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function ResumeOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScore(85);
    } catch (error) {
      console.error('Error analyzing resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resume Analysis</h3>
            <p className="text-sm text-gray-500">Upload your resume for AI-powered optimization</p>
          </div>
          {score && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Resume Score:</span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                {score}/100
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <label className="relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="mb-3 h-12 w-12 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
            />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">Analyzing...</span>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {score && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Strengths */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Strengths</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Strong Action Verbs</p>
                  <p className="text-sm text-gray-500">
                    Effective use of action verbs to describe achievements
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Quantifiable Results</p>
                  <p className="text-sm text-gray-500">
                    Good inclusion of metrics and achievements
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Clear Structure</p>
                  <p className="text-sm text-gray-500">
                    Well-organized sections and consistent formatting
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Improvement Areas */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h4 className="mb-4 text-lg font-semibold text-gray-900">Improvement Areas</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Keyword Optimization</p>
                  <p className="text-sm text-gray-500">
                    Add more industry-specific keywords for ATS optimization
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Skills Section</p>
                  <p className="text-sm text-gray-500">
                    Consider grouping skills by category for better readability
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Summary Statement</p>
                  <p className="text-sm text-gray-500">
                    Make the opening statement more impactful
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">Recommended Actions</h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button className="flex items-center justify-center rounded-lg border border-indigo-600 bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Optimize for ATS
                </button>
                <button className="flex items-center justify-center rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50">
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Summary
                </button>
                <button className="flex items-center justify-center rounded-lg border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50">
                  <Download className="mr-2 h-5 w-5" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}