<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100 pt-20 property-background">
    <!-- Property Grid Background -->
    <div class="property-grid"></div>
    <div class="container mx-auto px-4 py-8 relative z-10">
      <div class="max-w-6xl mx-auto">
        
        <!-- Header with Report Selector -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-100">Analysis Dashboard</h1>
              <p class="text-sm text-gray-400">Upload and analyze your inspection reports with AI</p>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Sidebar - Upload & Reports List -->
          <div class="lg:col-span-1">
            <!-- Upload Area -->
            <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl mb-4">
              <CardHeader>
                <CardTitle class="text-gray-100 text-base">Upload Report</CardTitle>
              </CardHeader>
              <CardContent>
                <!-- Drag and Drop Area -->
                <div 
                  class="drag-drop-area-compact"
                  :class="{ 'drag-over': isDragOver }"
                  @drop="handleDrop"
                  @dragover="handleDragOver"
                  @dragenter="handleDragEnter"
                  @dragleave="handleDragLeave"
                  @click="triggerFileInput"
                >
                  <input 
                    ref="fileInput"
                    id="pdfFile" 
                    type="file" 
                    accept=".pdf" 
                    class="hidden" 
                    @change="handleFileChange" 
                  />
                  
                  <div v-if="!isUploading" class="text-center">
                    <svg class="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-sm text-gray-300 mb-1">Drop PDF or click to browse</p>
                    <p class="text-xs text-gray-500">Max 10MB</p>
                  </div>
                  
                  <div v-else class="text-center">
                    <svg class="mx-auto h-8 w-8 text-blue-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p class="text-sm text-gray-300">Uploading...</p>
                  </div>
                </div>
                
                <div v-if="uploadMessage" class="mt-3">
                  <div :class="['p-2 rounded text-sm', uploadSuccess ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-red-900/30 border border-red-700 text-red-400']">
                    {{ uploadMessage }}
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Reports List -->
            <Card v-if="uploadedFiles.length > 0" class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
              <CardHeader>
                <CardTitle class="text-gray-100 text-base">Your Reports</CardTitle>
              </CardHeader>
              <CardContent class="p-0">
                <div class="max-h-80 overflow-y-auto">
                  <div 
                    v-for="file in uploadedFiles" 
                    :key="file.id" 
                    class="p-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors cursor-pointer"
                    :class="{ 'bg-gray-800/50': selectedReportId === file.id }"
                    @click="selectReport(file.id)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-200 truncate">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(file.created_at) }}</p>
                      </div>
                      <div class="flex items-center gap-1 ml-2">
                        <button 
                          @click.stop="deletePdf(file.name)"
                          class="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-2">
            <!-- Empty State -->
            <div v-if="!selectedReportId" class="text-center py-20">
              <svg class="mx-auto h-24 w-24 text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-300 mb-2">No Report Selected</h3>
              <p class="text-sm text-gray-500 mb-6">Upload a PDF report or select one from your list to begin analysis</p>
              <button @click="triggerFileInput" class="btn-auth">
                Upload Your First Report
              </button>
            </div>

            <!-- Report Analysis Interface -->
            <div v-else-if="selectedReport">
              <!-- Report Header -->
              <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl mb-4">
                <CardContent class="p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg text-gray-100">{{ selectedReport.name }}</h2>
                      <p class="text-xs text-gray-400">Uploaded {{ formatDate(selectedReport.created_at) }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button 
                        @click="viewPdf(selectedReport.name)" 
                        class="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-800/50"
                        title="View PDF"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="processPdf(selectedReport.name)" 
                        :disabled="isProcessing"
                        class="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        :title="isProcessing ? 'Processing...' : 'Process Report'"
                      >
                        <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Tabs Interface -->
              <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl">
                <CardContent class="p-0">
                  <!-- Tab Navigation -->
                  <div class="border-b border-gray-700">
                    <nav class="flex px-4" aria-label="Tabs">
                      <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                          'relative whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center justify-center',
                          activeTab === tab.id
                            ? 'border-green-500 text-green-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        ]"
                      >
                        <div class="flex items-center gap-2">
                          <!-- Overview Icon - Home/Dashboard -->
                          <svg v-if="tab.icon === 'overview-icon'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                          <!-- Text Icon -->
                          <svg v-else-if="tab.icon === 'text-icon'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <!-- Images Icon -->
                          <svg v-else-if="tab.icon === 'images-icon'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <!-- Analysis Icon - Chart/Graph -->
                          <svg v-else-if="tab.icon === 'analysis-icon'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                          </svg>
                          {{ tab.name }}
                          <span v-if="tab.badge" class="ml-1 bg-gray-700 text-gray-300 py-0.5 px-2 rounded-full text-xs">
                            {{ tab.badge }}
                          </span>
                        </div>
                      </button>
                    </nav>
                  </div>

                  <!-- Tab Content -->
                  <div class="p-6">
                    <!-- Overview Tab -->
                    <div v-if="activeTab === 'overview'">
                      <div v-if="!extractedText && !isProcessing" class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">Report Not Processed</h3>
                        <p class="text-sm text-gray-500 mb-6">Click "Process Report" to extract text and images from this PDF</p>
                        <button 
                          @click="processPdf(selectedReport.name)" 
                          :disabled="isProcessing"
                          class="btn-auth"
                        >
                          {{ isProcessing ? 'Processing...' : 'Process Report' }}
                        </button>
                      </div>

                      <div v-else-if="isProcessing" class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-blue-400 mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">Processing Report</h3>
                        <p class="text-sm text-gray-500">{{ processingStatus || 'Extracting text and images...' }}</p>
                      </div>

                      <div v-else class="space-y-4">
                        <!-- PDF Metadata -->
                        <div v-if="pdfMetadata">
                          <h4 class="font-medium text-gray-300 mb-3 text-sm">Document Information</h4>
                          <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div v-if="pdfMetadata.title"><span class="text-gray-400">Title:</span> <span class="text-gray-200">{{ pdfMetadata.title }}</span></div>
                              <div v-if="pdfMetadata.author"><span class="text-gray-400">Author:</span> <span class="text-gray-200">{{ pdfMetadata.author }}</span></div>
                              <div v-if="pdfMetadata.pageCount"><span class="text-gray-400">Pages:</span> <span class="text-gray-200">{{ pdfMetadata.pageCount }}</span></div>
                              <div v-if="pdfMetadata.creator"><span class="text-gray-400">Creator:</span> <span class="text-gray-200">{{ pdfMetadata.creator }}</span></div>
                            </div>
                          </div>
                        </div>

                        <!-- Quick Actions -->
                        <div>
                          <h4 class="font-medium text-gray-300 mb-3 text-sm">Quick Analysis</h4>
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button 
                              @click="summarizeText" 
                              :disabled="isSummarizing || !extractedText"
                              class="btn-auth-outline p-4 text-left"
                            >
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                  <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <div class="font-medium text-gray-200 text-sm">Python Analysis</div>
                                  <div class="text-xs text-gray-400">NLTK processing</div>
                                </div>
                              </div>
                            </button>

                            <button 
                              @click="analyzeWithOpenAI" 
                              :disabled="isAnalyzingOpenAI || !extractedText"
                              class="btn-auth-outline p-4 text-left"
                            >
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                  <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <div class="font-medium text-gray-200 text-sm">AI Analysis</div>
                                  <div class="text-xs text-gray-400">OpenAI GPT-4</div>
                                </div>
                              </div>
                            </button>

                            <button 
                              @click="analyzeWithGensim" 
                              :disabled="isAnalyzingGensim || !extractedText"
                              class="btn-auth-outline p-4 text-left"
                            >
                              <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                  <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                </div>
                                <div>
                                  <div class="font-medium text-gray-200 text-sm">Text Summary</div>
                                  <div class="text-xs text-gray-400">Gensim processing</div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Images Tab -->
                    <div v-else-if="activeTab === 'images'">
                      <div v-if="extractedImages && extractedImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div v-for="(image, index) in extractedImages" :key="index" class="relative border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 hover:border-gray-500 transition-colors aspect-square group cursor-pointer" @click="openImageModal(image, index)">
                          <img 
                            :src="image" 
                            class="w-full h-full object-cover pointer-events-none" 
                            :alt="`Image ${index + 1} from PDF`" 
                          />
                          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                              </svg>
                            </div>
                          </div>
                          <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {{ index + 1 }}
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">No Images Found</h3>
                        <p class="text-sm text-gray-500">{{ extractedText ? 'This PDF contains no extractable images' : 'Process the report first to extract images' }}</p>
                      </div>
                    </div>

                    <!-- Text Tab -->
                    <div v-else-if="activeTab === 'text'">
                      <div v-if="extractedText" class="space-y-4">
                        <!-- Text Actions -->
                        <div class="flex justify-between items-center">
                          <h4 class="font-medium text-gray-300 text-sm">Extracted Text Content</h4>
                          <div class="flex gap-2">
                            <button 
                              @click="summarizeText" 
                              :disabled="isSummarizing || !extractedText"
                              class="btn-auth-outline btn-sm text-purple-400 border-purple-700/50 hover:border-purple-500/50"
                            >
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                              </svg>
                              <span v-if="isSummarizing">Analyzing...</span>
                              <span v-else>Analyze (Python)</span>
                            </button>
                            <button 
                              @click="analyzeWithOpenAI" 
                              :disabled="isAnalyzingOpenAI || !extractedText"
                              class="btn-auth-outline btn-sm text-blue-400 border-blue-700/50 hover:border-blue-500/50"
                            >
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                              </svg>
                              <span v-if="isAnalyzingOpenAI">Analyzing...</span>
                              <span v-else>Analyze (OpenAI)</span>
                            </button>
                            <button 
                              @click="analyzeWithGensim" 
                              :disabled="isAnalyzingGensim || !extractedText"
                              class="btn-auth-outline btn-sm text-green-400 border-green-700/50 hover:border-green-500/50"
                            >
                              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <span v-if="isAnalyzingGensim">Analyzing...</span>
                              <span v-else>Analyze (Gensim)</span>
                            </button>
                          </div>
                        </div>

                        <!-- Text Content -->
                        <div class="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                          <pre class="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{{ extractedText }}</pre>
                        </div>

                        <!-- Text Statistics -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div class="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
                            <div class="text-base font-semibold text-gray-200">{{ extractedText.length.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs">Characters</div>
                          </div>
                          <div class="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
                            <div class="text-base font-semibold text-gray-200">{{ extractedText.split(/\s+/).length.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs">Words</div>
                          </div>
                          <div class="bg-gray-800/30 border border-gray-700 rounded-lg p-3 text-center">
                            <div class="text-base font-semibold text-gray-200">{{ extractedText.split(/\n/).length.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs">Lines</div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">No Text Extracted</h3>
                        <p class="text-sm text-gray-500">Process the report first to extract text content</p>
                      </div>
                    </div>

                    <!-- Analysis Tab -->
                    <div v-else-if="activeTab === 'analysis'">
                      <!-- Analysis Results -->
                      <div v-if="summarizeStatus || openAIStatus || gensimStatus || summarizedIssues.length > 0 || gensimSummary" class="space-y-4">
                        <!-- Analysis Status Messages -->
                        <div v-if="summarizeStatus" class="p-4 rounded-lg bg-purple-900/30 border border-purple-700">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <span class="font-medium text-purple-300">Python NLTK Analysis</span>
                          </div>
                          <p class="text-purple-200">{{ summarizeStatus }}</p>
                        </div>
                        
                        <div v-if="openAIStatus" class="p-4 rounded-lg bg-blue-900/30 border border-blue-700">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            <span class="font-medium text-blue-300">OpenAI GPT-4 Analysis</span>
                          </div>
                          <p class="text-blue-200">{{ openAIStatus }}</p>
                        </div>
                        
                        <div v-if="gensimStatus" class="p-4 rounded-lg bg-green-900/30 border border-green-700">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="font-medium text-green-300">Gensim Summary</span>
                          </div>
                          <p class="text-green-200">{{ gensimStatus }}</p>
                        </div>
                        
                        <!-- Gensim Summary Text -->
                        <div v-if="gensimSummary" class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <h5 class="font-medium text-gray-200 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Text Summary
                          </h5>
                          <div class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{{ gensimSummary }}</div>
                        </div>
                        
                        <!-- Issues List -->
                        <div v-if="summarizedIssues.length > 0">
                          <h5 class="font-medium text-gray-200 mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            Identified Issues ({{ summarizedIssues.length }})
                          </h5>
                          <div class="space-y-3">
                            <div 
                              v-for="(issue, index) in summarizedIssues" 
                              :key="index" 
                              class="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                            >
                              <div class="flex justify-between items-start mb-2">
                                <h6 class="font-medium text-gray-200">{{ issue.issue }}</h6>
                                <span 
                                  :class="[
                                    'px-2 py-1 rounded text-xs font-medium',
                                    issue.severity === 'Major' 
                                      ? 'bg-red-900/30 border border-red-700 text-red-300' 
                                      : 'bg-yellow-900/30 border border-yellow-700 text-yellow-300'
                                  ]"
                                >
                                  {{ issue.severity }}
                                </span>
                              </div>
                              <p class="text-gray-400 text-sm">{{ issue.description }}</p>
                            </div>
                          </div>
                        </div>

                        <div class="flex justify-end">
                          <button @click="clearAnalysisResults" class="btn-auth-outline btn-sm text-red-400 border-red-700/50 hover:border-red-500/50">
                            Clear Analysis Results
                          </button>
                        </div>
                      </div>

                      <div v-else class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">No Analysis Yet</h3>
                        <p class="text-sm text-gray-500 mb-6">Run an analysis from the Overview tab to see results here</p>
                        <button @click="activeTab = 'overview'" class="btn-auth-outline">
                          Go to Overview
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- AI Chat Interface - Separate Card -->
              <Card v-if="selectedReport && extractedText" class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl mt-4">
                <CardHeader>
                  <CardTitle class="text-gray-100 text-base flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    AI Chat Assistant
                    <span class="ml-2 text-xs text-gray-400 font-normal">Ask questions about your inspection report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-4">
                    <!-- Chat Messages Area -->
                    <div class="h-96 bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-y-auto">
                      <div class="flex items-center justify-center h-full text-center">
                        <div>
                          <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                          </svg>
                          <h3 class="text-lg font-medium text-gray-300 mb-2">Start a Conversation</h3>
                          <p class="text-gray-500 mb-4">Ask me anything about your inspection report!</p>
                          <div class="text-sm text-gray-400">
                            <p>Try asking:</p>
                            <ul class="mt-2 space-y-1">
                              <li>"What are the main issues found?"</li>
                              <li>"Summarize the electrical section"</li>
                              <li>"What safety concerns should I address first?"</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ask about your inspection report..." 
                        class="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        disabled
                      />
                      <button 
                        class="btn-auth px-6 py-3" 
                        disabled
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Coming Soon Notice -->
                    <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                      <div class="flex items-center gap-2 text-blue-300 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-medium">AI Chat Coming Soon</span>
                      </div>
                      <p class="text-blue-200/80 text-sm mt-1">This feature will allow you to have natural conversations with your inspection reports using advanced AI.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <!-- Image Modal Gallery with Navigation -->
        <!-- Debug: selectedImage = {{ selectedImage }} -->
        <div v-if="selectedImage" class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" @click="closeImageModal">
          <div class="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            <!-- Close Button -->
            <button @click="closeImageModal" class="absolute top-16 right-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <!-- Previous Button -->
            <button 
              v-if="extractedImages.length > 1"
              @click.stop="navigateImage('prev')" 
              class="absolute left-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-3 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <!-- Image -->
            <div class="flex items-center justify-center w-full h-full" @click.stop>
              <img :src="selectedImage" class="max-w-full max-h-full object-contain" :alt="`Image ${selectedImageIndex + 1} of ${extractedImages.length}`" />
            </div>
            
            <!-- Next Button -->
            <button 
              v-if="extractedImages.length > 1"
              @click.stop="navigateImage('next')" 
              class="absolute right-4 z-10 bg-gray-900/80 hover:bg-gray-800 text-white rounded-full p-3 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
            
            <!-- Image Counter -->
            <div v-if="extractedImages.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-2 rounded-full text-sm">
              {{ selectedImageIndex + 1 }} / {{ extractedImages.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';

const fileInput = ref(null);
const selectedFile = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');
const uploadSuccess = ref(false);
const uploadedFiles = ref([]);
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const extractedImages = ref([]);
const extractedText = ref('');
const pdfMetadata = ref(null);
const selectedImage = ref(null);
const selectedImageIndex = ref(0);
const processingStatus = ref('');
const isProcessing = ref(false);
const summarizedIssues = ref([]);
const isSummarizing = ref(false);
const summarizeStatus = ref('');
const isAnalyzingOpenAI = ref(false);
const openAIStatus = ref('');
const isAnalyzingGensim = ref(false);
const gensimStatus = ref('');
const gensimSummary = ref('');
const isDragOver = ref(false);

// New variables for improved UX
const selectedReportId = ref('');
const activeTab = ref('overview');

// Computed properties
const selectedReport = computed(() => {
  return uploadedFiles.value.find(file => file.id === selectedReportId.value) || null;
});

// Tab configuration
const tabs = computed(() => [
  { 
    id: 'overview', 
    name: 'Overview', 
    icon: 'overview-icon',
    badge: null
  },
  { 
    id: 'text', 
    name: 'Text', 
    icon: 'text-icon',
    badge: extractedText.value ? '1' : null
  },
  { 
    id: 'images', 
    name: 'Images', 
    icon: 'images-icon',
    badge: extractedImages.value.length || null
  },
  { 
    id: 'analysis', 
    name: 'Analysis', 
    icon: 'analysis-icon',
    badge: (summarizedIssues.value.length || (gensimSummary.value ? 1 : 0)) || null
  }
]);

// Methods
const selectReport = (reportId) => {
  selectedReportId.value = reportId;
  // Clear current analysis data when switching reports
  clearResults();
};

const switchReport = () => {
  // Clear current analysis data when switching reports
  clearResults();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file;
    uploadMessage.value = '';
    // Automatically upload the selected file
    await uploadPdf();
  } else {
    selectedFile.value = null;
    uploadMessage.value = 'Please select a valid PDF file';
    uploadSuccess.value = false;
  }
};

// Drag and drop handlers
const handleDrop = async (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      selectedFile.value = file;
      uploadMessage.value = '';
      // Automatically upload the dropped file
      await uploadPdf();
    } else {
      uploadMessage.value = 'Please drop a valid PDF file';
      uploadSuccess.value = false;
    }
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragEnter = (event) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event) => {
  event.preventDefault();
  // Only set to false if we're leaving the drop area completely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false;
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const clearFile = () => {
  selectedFile.value = null;
  uploadMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const resetUploadArea = () => {
  selectedFile.value = null;
  uploadMessage.value = '';
  uploadSuccess.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};

const uploadPdf = async () => {
  if (!selectedFile.value || !user.value) return;
  
  isUploading.value = true;
  uploadMessage.value = '';
  
  try {
    // Get original filename and sanitize it for storage
    const originalName = selectedFile.value.name;
    
    // Sanitize the filename to remove special characters
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Create the path with user ID as folder
    const filePath = `${user.value.id}/${sanitizedName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('inspection-reports')
      .upload(filePath, selectedFile.value, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Store metadata in database if needed
    const { error: metadataError } = await supabase
      .from('report_files')
      .insert({
        name: originalName, // Store the truly original name for display
        user_id: user.value.id,
        storage_path: filePath,
        size: selectedFile.value.size
      });
    
    if (metadataError) console.error('Metadata storage error:', metadataError);
    
    uploadSuccess.value = true;
    uploadMessage.value = 'PDF uploaded successfully!';
    fetchUserFiles();
    
    // Clear file input but keep selectedFile for UI feedback
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    
    // Auto-reset after 3 seconds and select the newly uploaded file
    setTimeout(() => {
      if (uploadSuccess.value) {
        resetUploadArea();
        // Auto-select the newly uploaded file
        if (uploadedFiles.value.length > 0) {
          const newestFile = uploadedFiles.value[0]; // Should be first due to desc sort
          selectedReportId.value = newestFile.id;
        }
      }
    }, 3000);
    
  } catch (error) {
    console.error('Upload error:', error);
    uploadSuccess.value = false;
    uploadMessage.value = error.message || 'An error occurred during upload';
    selectedFile.value = null;
  } finally {
    isUploading.value = false;
  }
};

const fetchUserFiles = async () => {
  if (!user.value) return;

  try {
    // Fetch all objects from the inspection-reports bucket
    const { data, error } = await supabase.storage
      .from('inspection-reports')
      .list(user.value.id, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;

    // Map the storage objects to the uploadedFiles array
    uploadedFiles.value = data.map(file => ({
      id: file.id || file.name, // Use name as fallback for id
      name: file.name,
      created_at: file.created_at || new Date().toISOString(), // Fallback to current date if missing
      size: file.size || 0 // Fallback to 0 if size is missing
    }));
  } catch (error) {
    console.error('Error fetching files from storage:', error);
  }
};

const viewPdf = async (fileName) => {
  try {
    // Generate a signed URL for the file in the storage bucket
    const filePath = `${user.value.id}/${fileName}`;
    const { data: urlData, error: urlError } = await supabase.storage
      .from('inspection-reports')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (urlError) throw urlError;

    // Trigger file download
    const link = document.createElement('a');
    link.href = urlData.signedUrl;
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error generating download URL:', error);
    alert('Failed to download file: ' + (error.message || 'Unknown error'));
  }
};

const processPdf = async (fileName) => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  processingStatus.value = 'Processing PDF - extracting text and images...';
  extractedImages.value = [];
  extractedText.value = '';
  pdfMetadata.value = null;
  
  try {
    const response = await fetch('/api/process-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, userId: user.value.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process PDF');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    // Update the UI with processed data
    processingStatus.value = `PDF processed successfully! Found ${result.images?.length || 0} images.`;
    extractedText.value = result.text || 'No text content found in PDF.';
    extractedImages.value = result.images || [];
    pdfMetadata.value = result.metadata || null;
    
    // Log metadata for debugging
    if (result.metadata) {
      console.log('PDF Metadata:', result.metadata);
    }
    
  } catch (error) {
    console.error('Error processing PDF:', error);
    processingStatus.value = `Error: ${error.message || 'Unknown error processing PDF'}`;
    extractedText.value = '';
    extractedImages.value = [];
    pdfMetadata.value = null;
  } finally {
    isProcessing.value = false;
  }
};

const clearResults = () => {
  processingStatus.value = '';
  extractedText.value = '';
  extractedImages.value = [];
  pdfMetadata.value = null;
  selectedImage.value = null;
  selectedImageIndex.value = 0;
  summarizedIssues.value = [];
  summarizeStatus.value = '';
  isSummarizing.value = false;
  isAnalyzingOpenAI.value = false;
  openAIStatus.value = '';
  isAnalyzingGensim.value = false;
  gensimStatus.value = '';
  gensimSummary.value = '';
};

const openImageModal = (imageUrl, index) => {
  console.log('openImageModal called with:', imageUrl, index);
  console.log('Before setting selectedImage:', selectedImage.value);
  selectedImage.value = imageUrl;
  selectedImageIndex.value = index;
  console.log('After setting selectedImage:', selectedImage.value);
};

const navigateImage = (direction) => {
  if (extractedImages.value.length === 0) return;
  
  if (direction === 'next') {
    selectedImageIndex.value = (selectedImageIndex.value + 1) % extractedImages.value.length;
  } else {
    selectedImageIndex.value = selectedImageIndex.value === 0 
      ? extractedImages.value.length - 1 
      : selectedImageIndex.value - 1;
  }
  
  selectedImage.value = extractedImages.value[selectedImageIndex.value];
};

const closeImageModal = () => {
  selectedImage.value = null;
  selectedImageIndex.value = 0;
};

// Summarize extracted text using Python NLTK
const summarizeText = async () => {
  if (!extractedText.value || isSummarizing.value) return;
  
  isSummarizing.value = true;
  summarizeStatus.value = 'Analyzing text for issues...';
  summarizedIssues.value = [];
  
  try {
    const response = await fetch('/api/summarize-python', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to summarize text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    summarizedIssues.value = result.issues || [];
    summarizeStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`;
    
    // Switch to analysis tab to show results
    activeTab.value = 'analysis';
    
  } catch (error) {
    console.error('Error summarizing text:', error);
    summarizeStatus.value = `Error: ${error.message || 'Unknown error during summarization'}`;
    summarizedIssues.value = [];
  } finally {
    isSummarizing.value = false;
  }
};

// Analyze extracted text using OpenAI GPT-4
const analyzeWithOpenAI = async () => {
  if (!extractedText.value || isAnalyzingOpenAI.value) return;
  
  isAnalyzingOpenAI.value = true;
  openAIStatus.value = 'Analyzing text with OpenAI GPT-4...';
  summarizedIssues.value = [];
  
  try {
    const response = await fetch('/api/summarize-issues-fixed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    summarizedIssues.value = result.issues || [];
    openAIStatus.value = `Found ${result.issues?.length || 0} issues in the inspection report.`;
    
    // Switch to analysis tab to show results
    activeTab.value = 'analysis';
    
  } catch (error) {
    console.error('Error analyzing text with OpenAI:', error);
    openAIStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`;
    summarizedIssues.value = [];
  } finally {
    isAnalyzingOpenAI.value = false;
  }
};

// Analyze extracted text using Gensim
const analyzeWithGensim = async () => {
  if (!extractedText.value || isAnalyzingGensim.value) return;
  
  isAnalyzingGensim.value = true;
  gensimStatus.value = 'Analyzing text with Gensim...';
  gensimSummary.value = '';
  
  try {
    const response = await fetch('/api/summarize-gensim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: extractedText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze text');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    gensimSummary.value = result.summary || '';
    gensimStatus.value = gensimSummary.value 
      ? 'Text summarized successfully' 
      : 'No summary generated';
    
    // Switch to analysis tab to show results
    activeTab.value = 'analysis';
    
  } catch (error) {
    console.error('Error analyzing text with Gensim:', error);
    gensimStatus.value = `Error: ${error.message || 'Unknown error during analysis'}`;
    gensimSummary.value = '';
  } finally {
    isAnalyzingGensim.value = false;
  }
};

// Clear analysis results
const clearAnalysisResults = () => {
  summarizedIssues.value = [];
  summarizeStatus.value = '';
  openAIStatus.value = '';
  gensimStatus.value = '';
  gensimSummary.value = '';
  isSummarizing.value = false;
  isAnalyzingOpenAI.value = false;
  isAnalyzingGensim.value = false;
};

// Keyboard navigation for image gallery
const handleKeyPress = (event) => {
  if (!selectedImage.value) return;
  
  if (event.key === 'ArrowLeft') {
    navigateImage('prev');
  } else if (event.key === 'ArrowRight') {
    navigateImage('next');
  } else if (event.key === 'Escape') {
    closeImageModal();
  }
};

const deletePdf = async (fileName) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  try {
    // Delete the file from the storage bucket
    const filePath = `${user.value.id}/${fileName}`;
    const { error: storageError } = await supabase.storage
      .from('inspection-reports')
      .remove([filePath]);

    if (storageError) throw storageError;

    // If the deleted file was selected, clear selection
    if (selectedReport.value && selectedReport.value.name === fileName) {
      selectedReportId.value = '';
      clearResults();
    }

    // Refresh the file list
    fetchUserFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Failed to delete file: ' + (error.message || 'Unknown error'));
  }
};

// Watch for user changes and fetch files when the user is logged in
watch(user, (newUser) => {
  if (newUser) {
    fetchUserFiles();
  } else {
    uploadedFiles.value = [];
    selectedReportId.value = '';
  }
}, { immediate: true });

// Watch for selectedReportId changes and clear analysis data
watch(selectedReportId, () => {
  clearResults();
});

onMounted(() => {
  if (user.value) {
    fetchUserFiles();
  }
  
  // Add keyboard event listener for image gallery navigation
  document.addEventListener('keydown', handleKeyPress);
  
  // Check the current route to handle redirects from /upload-pdf
  const route = useRoute();
  if (route.path === '/upload-pdf') {
    const router = useRouter();
    router.replace('/analysis');
  }
});

// Clean up event listener on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.backdrop-blur {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Button styles matching sign-in page */
.btn-auth {
  background: #22c55e;
  color: #000;
  font-weight: 600;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-auth:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
}

.btn-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-auth-outline {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
  color: #fff;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-auth-outline:hover:not(:disabled) {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid #4ade80;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-auth-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Small button variant */
.btn-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Color variants for outline buttons */
.btn-auth-outline.text-blue-400:hover:not(:disabled) {
  border-color: #3b82f6;
}

.btn-auth-outline.text-red-400:hover:not(:disabled) {
  border-color: #ef4444;
}

.btn-auth-outline.text-purple-400:hover:not(:disabled) {
  border-color: #a855f7;
}

.btn-auth-outline.text-green-400:hover:not(:disabled) {
  border-color: #22c55e;
}

/* Compact Drag and Drop Area Styles */
.drag-drop-area-compact {
  border: 2px dashed #374151;
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  background: rgba(31, 41, 55, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-drop-area-compact:hover {
  border-color: #4ade80;
  background: rgba(31, 41, 55, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.drag-drop-area-compact.drag-over {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.hidden {
  display: none;
}

/* Spinning animation for upload indicator */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Add some subtle animation for hover effects */
.hover\:border-green-500\/50:hover {
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.15);
  transition: all 0.2s ease;
}

.hover\:border-red-500\/50:hover {
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.15);
  transition: all 0.2s ease;
}

/* Property Blueprint Background - matching sign-in page */
.property-background {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.property-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.15;
  background-image: 
    /* Blueprint grid lines */
    linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
    /* Room outlines */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M100,100 L100,250 L200,250 L200,180 L280,180 L280,100 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M300,300 L300,400 L400,400 L400,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.2)' stroke-width='2' d='M80,300 L80,380 L180,380 L180,300 Z'/%3E%3Cpath fill='none' stroke='rgba(49, 130, 206, 0.15)' stroke-width='1.5' d='M200,100 L240,60 L420,60 L420,180 L380,180 L380,120 L280,120'/%3E%3C/svg%3E"),
    /* Location pins for properties */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Ccircle cx='150' cy='150' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='450' cy='250' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='300' cy='420' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='100' cy='350' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='500' cy='100' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3Ccircle cx='400' cy='500' r='6' fill='rgba(52, 211, 153, 0.4)'/%3E%3C/svg%3E");
  background-size: 40px 40px, 40px 40px, 1000px 1000px, 1200px 1200px;
  background-position: center center;
}

/* Tab interface improvements */
.grid {
  gap: 1rem;
}

/* Better scrollbars for content areas */
.max-h-80 {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.max-h-80::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-80::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Smooth transitions for tab content */
.transition-colors {
  transition: color 0.2s ease, border-color 0.2s ease;
}

/* Enhanced card layouts */
.aspect-square {
  aspect-ratio: 1;
}

/* Loading states */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}
</style>
