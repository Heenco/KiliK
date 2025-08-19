<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900 text-gray-100 pt-20 property-background font-apple">
    <!-- Property Grid Background -->
    <div class="property-grid"></div>
    <div class="max-w-screen-2xl mx-auto px-6 py-8 relative z-10">
      <div class="max-w-screen-2xl mx-auto">
        
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
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-5rem)]">
          
          <!-- Left Sidebar - Upload & Reports List (full-height) -->
          <div class="lg:col-span-1 flex min-h-0">
            <div class="w-full h-full flex flex-col min-h-0">
              <FileManager
                class="flex-1 overflow-auto"
                :selectedReportId="selectedReportId"
                @report-selected="handleReportSelected"
                @file-deleted="handleFileDeleted"
                @file-uploaded="handleFileUploaded"
              />
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-3 flex flex-col">
            <!-- Empty State -->
            <EmptyState 
              v-if="!selectedReportId"
              @upload-click="triggerFileUpload"
            />

            <!-- Loading State when we have ID but no report object yet -->
            <div v-else-if="selectedReportId && !selectedReport" class="text-center py-12">
              <svg class="mx-auto h-16 w-16 text-green-400 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <h3 class="text-base font-medium text-gray-300 mb-2">Loading Report</h3>
              <p class="text-sm text-gray-500">Preparing report data...</p>
            </div>

            <!-- Report Analysis Interface -->
            <div v-else-if="selectedReport">
              <!-- Report Header -->
              <ReportHeader 
                :selectedReport="selectedReport"
                @pdf-processed="handlePdfProcessed"
                @pdf-view-requested="handlePdfViewRequested"
              />

              <!-- Tabs Interface -->
              <Card class="border border-gray-700 bg-gray-900/80 backdrop-blur shadow-xl rounded-xl">
                <CardContent class="p-6">
                  <!-- Shadcn/ui Tabs Component -->
                  <Tabs :value="activeTab" @update:value="setActiveTab" class="w-full">
                    <TabsList class="bg-gray-800/50 border border-gray-700 p-1 rounded-lg w-full grid grid-cols-4 gap-1 mb-6 tabs-dark">
                      <TabsTrigger 
                        v-for="tab in tabs" 
                        :key="tab.id" 
                        :value="tab.id"
                        class="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400 data-[state=active]:shadow-sm text-gray-400 hover:text-gray-300 rounded-md transition-all duration-200 font-medium"
                      >
                        <div class="flex items-center gap-2">
                          <!-- Analysis Icon - Enhanced Chart -->
                          <svg v-if="tab.icon === 'analysis-icon'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          </svg>
                          <span class="font-medium">{{ tab.name }}</span>
                          <span v-if="tab.badge" class="ml-1 bg-gray-600 data-[state=active]:bg-green-500/20 text-gray-300 data-[state=active]:text-green-300 py-0.5 px-1.5 rounded-full text-xs font-medium">
                          </span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    <!-- Tab Content -->
                    <TabsContent value="overview" class="mt-0">
                      <!-- Overview Tab -->
                        <!-- Report Selection Loading State -->
                        <div v-if="isSelectingReport" class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-green-400 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">Loading Report</h3>
                        <p class="text-sm text-gray-500">Preparing report for analysis...</p>
                      </div>
                      
                      <!-- Report Not Processed State -->
                      <div v-else-if="!extractedText && !isProcessing" class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">Report Not Processed</h3>
                        <p class="text-sm text-gray-500 mb-6">Click "Process Report" to extract text and images from this PDF</p>
                        <button 
                          @click="handleProcessPdf(selectedReport.name)" 
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
                          <h4 class="font-semibold text-gray-200 mb-4 text-sm tracking-wide">Document Information</h4>
                          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div v-if="pdfMetadata.title"><span class="text-gray-400 font-medium">Title:</span> <span class="text-gray-200">{{ pdfMetadata.title }}</span></div>
                              <div v-if="pdfMetadata.author"><span class="text-gray-400 font-medium">Author:</span> <span class="text-gray-200">{{ pdfMetadata.author }}</span></div>
                              <div v-if="pdfMetadata.pageCount"><span class="text-gray-400 font-medium">Pages:</span> <span class="text-gray-200">{{ pdfMetadata.pageCount }}</span></div>
                              <div v-if="pdfMetadata.creator"><span class="text-gray-400 font-medium">Creator:</span> <span class="text-gray-200">{{ pdfMetadata.creator }}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <!-- Images Tab -->
                    <TabsContent value="images" class="mt-0">
                      <div v-if="extractedImages && extractedImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div v-for="(image, index) in extractedImages" :key="index" class="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/50 hover:border-gray-500 transition-all duration-200 hover:shadow-lg aspect-square group cursor-pointer" @click="handleOpenImageModal(image, index)">
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
                          <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
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
                    </TabsContent>

                    <!-- Text Tab -->
                    <TabsContent value="text" class="mt-0">
                      <div v-if="extractedText" class="space-y-4">
                        <!-- Text Actions -->
                        <div class="flex justify-between items-center">
                          <h4 class="font-semibold text-gray-200 text-sm tracking-wide">Extracted Text Content</h4>
                        </div>

                        <!-- Text Content -->
                        <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 max-h-96 overflow-y-auto backdrop-blur-sm">
                          <pre class="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">{{ extractedText }}</pre>
                        </div>

                        <!-- Text Statistics -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div class="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center backdrop-blur-sm">
                            <div class="text-lg font-bold text-gray-200">{{ getTextStatistics().characters.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs font-medium">Characters</div>
                          </div>
                          <div class="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center backdrop-blur-sm">
                            <div class="text-lg font-bold text-gray-200">{{ getTextStatistics().words.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs font-medium">Words</div>
                          </div>
                          <div class="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-center backdrop-blur-sm">
                            <div class="text-lg font-bold text-gray-200">{{ getTextStatistics().lines.toLocaleString() }}</div>
                            <div class="text-gray-400 text-xs font-medium">Lines</div>
                          </div>
                        </div>
                      </div>
                      
                      <div v-else class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <h3 class="text-base font-medium text-gray-300 mb-2">No Text Extracted</h3>
                        <p class="text-sm text-gray-500">Process the report first to extract text content</p>
                      </div>
                    </TabsContent>

                    <!-- Analysis Tab -->
                    <TabsContent value="analysis" class="mt-0">
                      <!-- Analysis Results -->
                      <div v-if="summarizeStatus || openAIStatus || gensimStatus || summarizedIssues.length > 0 || gensimSummary || ollamaSummary || deepInfraStatus || deepInfraSummary" class="space-y-4">
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
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <span class="font-medium text-green-300">Gensim Summary</span>
                          </div>
                          <p class="text-green-200">{{ gensimStatus }}</p>
                        </div>
                        
                        <div v-if="ollamaStatus" class="p-4 rounded-lg bg-indigo-900/30 border border-indigo-700">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"></path></svg>
                            <span class="font-medium text-indigo-300">Ollama Analysis</span>
                          </div>
                          <p class="text-indigo-200">{{ ollamaStatus }}</p>
                        </div>
                        
                        <div v-if="deepInfraStatus" class="p-4 rounded-lg bg-orange-900/30 border border-orange-700">
                          <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <span class="font-medium text-orange-300">DeepInfra Analysis</span>
                          </div>
                          <p class="text-orange-200">{{ deepInfraStatus }}</p>
                        </div>
                        
                        <!-- Gensim Summary Text -->
                        <div v-if="gensimSummary" class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <h5 class="font-medium text-gray-200 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            Text Summary
                          </h5>
                          <div class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{{ gensimSummary }}</div>
                        </div>
                        
                        <!-- Ollama Summary Text -->
                        <div v-if="ollamaSummary" class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <h5 class="font-medium text-gray-200 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3"></path></svg>
                            Ollama Result
                          </h5>
                          <div class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{{ ollamaSummary }}</div>
                        </div>
                        
                        <!-- DeepInfra Summary Text -->
                        <div v-if="deepInfraSummary" class="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <h5 class="font-medium text-gray-200 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            DeepInfra Analysis
                          </h5>
                          <div class="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{{ deepInfraSummary }}</div>
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
                        <h3 class="text-base font-medium text-gray-300 mb-2">Start Analysis</h3>
                        <p class="text-sm text-gray-500 mb-6">Choose an analysis method to begin processing your inspection report</p>
                        
                        <!-- Analysis Action Buttons -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                          <button 
                            @click="handleSummarizeText" 
                            :disabled="isSummarizing || !extractedText"
                            class="group btn-auth-outline p-4 text-left rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                          >
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-xl flex items-center justify-center transition-colors">
                                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                              </div>
                              <div>
                                <div class="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">Python Analysis</div>
                                <div class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">NLTK processing</div>
                              </div>
                            </div>
                          </button>

                          <button 
                            @click="handleAnalyzeWithDeepInfra"
                            :disabled="isAnalyzingDeepInfra || !extractedText"
                            class="group btn-auth-outline p-4 text-left rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                          >
                            <div class="flex items-center gap-3">
                              <div class="w-10 h-10 bg-orange-500/20 group-hover:bg-orange-500/30 rounded-xl flex items-center justify-center transition-colors">
                                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                              </div>
                              <div>
                                <div class="font-semibold text-gray-200 text-sm group-hover:text-white transition-colors">DeepInfra Analysis</div>
                                <div class="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Qwen2.5-VL-32B</div>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
                    <div ref="chatContainer" class="h-96 bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-y-auto">
                      <!-- Empty state when no messages -->
                      <div v-if="chatMessages.length === 0" class="flex items-center justify-center h-full text-center">
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

                      <!-- Chat messages -->
                      <div v-else class="space-y-4">
                        <div 
                          v-for="(message, index) in chatMessages" 
                          :key="index"
                          :class="[
                            'flex',
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          ]"
                        >
                          <div 
                            :class="[
                              'max-w-[80%] rounded-lg px-4 py-2',
                              message.role === 'user' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-700 text-gray-100'
                            ]"
                          >
                            <div class="text-sm whitespace-pre-wrap">{{ message.content }}</div>
                            <div class="text-xs opacity-70 mt-1">
                              {{ new Date(message.timestamp).toLocaleTimeString() }}
                            </div>
                          </div>
                        </div>
                        
                        <!-- Typing indicator -->
                        <div v-if="isChatting" class="flex justify-start">
                          <div class="bg-gray-700 text-gray-100 rounded-lg px-4 py-2">
                            <div class="flex items-center space-x-2">
                              <div class="flex space-x-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                              </div>
                              <span class="text-sm text-gray-400">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="flex gap-2">
                      <input 
                        v-model="chatInput"
                        @keypress="handleChatKeyPress"
                        type="text" 
                        placeholder="Ask about your inspection report..." 
                        :disabled="isChatting || !extractedText"
                        class="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                      />
                      <button 
                        @click="handleSendChatMessage"
                        :disabled="isChatting || !chatInput.trim() || !extractedText"
                        class="btn-auth px-6 py-3" 
                      >
                        <svg v-if="!isChatting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </button>
                    </div>

                    <!-- Chat Controls -->
                    <div class="flex justify-between items-center">
                      <div class="text-sm text-gray-400">
                        <span v-if="!extractedText">Process a report first to enable chat</span>
                        <span v-else-if="chatMessages.length > 0">{{ chatMessages.length }} messages</span>
                        <span v-else>Powered by DeepInfra Qwen2.5-VL-32B</span>
                      </div>
                      <button 
                        v-if="chatMessages.length > 0"
                        @click="clearChatHistory"
                        class="btn-auth-outline btn-sm text-red-400 border-red-700/50 hover:border-red-500/50"
                      >
                        Clear Chat
                      </button>
                    </div>

                    <!-- Error Display -->
                    <div v-if="chatError" class="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                      <div class="flex items-center gap-2 text-red-300 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-medium">Chat Error</span>
                      </div>
                      <p class="text-red-200/80 text-sm mt-1">{{ chatError }}</p>
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
              @click.stop="handleNavigateImage('prev')" 
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
              @click.stop="handleNavigateImage('next')" 
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

// Import our new components
import FileManager from '~/components/analysis/FileManager.vue';
import ReportHeader from '~/components/analysis/ReportHeader.vue';
import EmptyState from '~/components/analysis/EmptyState.vue';

// Composables
const {
  selectedFile,
  isUploading,
  uploadMessage,
  uploadSuccess,
  uploadedFiles,
  isDragOver,
  uploadPdf,
  deletePdf,
  handleFileSelect,
  clearFile,
  resetUploadArea,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  formatFileSize,
  formatDate
} = useFileUpload();

const {
  extractedImages,
  extractedText,
  pdfMetadata,
  isProcessing,
  processingStatus,
  processPdf,
  viewPdf,
  getTextStatistics
} = usePdfProcessor();

const {
  summarizedIssues,
  isSummarizing,
  summarizeStatus,
  isAnalyzingOpenAI,
  openAIStatus,
  isAnalyzingGensim,
  gensimStatus,
  gensimSummary,
  isAnalyzingOllama,
  ollamaStatus,
  ollamaSummary,
  isAnalyzingDeepInfra,
  deepInfraStatus,
  deepInfraSummary,
  summarizeText,
  analyzeWithOpenAI,
  analyzeWithGensim,
  analyzeWithOllama,
  analyzeWithDeepInfra,
  clearAnalysisResults,
  
  // Chat functionality
  chatMessages,
  isChatting,
  chatError,
  sendChatMessage,
  clearChatHistory
} = useAnalysisTools();

const {
  selectedImage,
  selectedImageIndex,
  openImageModal,
  navigateImage,
  closeImageModal,
  setupKeyboardNavigation
} = useImageGallery();

const {
  selectedReportId,
  activeTab,
  selectedReport,
  tabs,
  selectReport,
  setActiveTab
} = useAnalysisState();

// Local refs (still needed for some functionality)
const fileInput = ref(null);
const chatInput = ref('');
const chatContainer = ref(null);

// Local methods
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (handleFileSelect(file)) {
    // Automatically upload the selected file
    await uploadPdf();
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const triggerFileUpload = () => {
  // This is called from EmptyState component
  triggerFileInput();
};

// Component event handlers
const handleReportSelected = (reportId) => {
  console.log('Analysis page: Report selected', reportId); // Debug log
  selectReport(reportId);
};

const handleFileDeleted = (fileName) => {
  // If the deleted file was selected, clear selection
  if (selectedReport.value && selectedReport.value.name === fileName) {
    selectedReportId.value = '';
  }
};

const handleFileUploaded = () => {
  // File uploaded successfully - FileManager will handle auto-selection
  console.log('File uploaded successfully');
};

const handlePdfProcessed = () => {
  // PDF processed successfully
  console.log('PDF processed successfully');
};

const handlePdfViewRequested = () => {
  // PDF view/download requested
  console.log('PDF view requested');
};

// Enhanced methods using composables
const handleDropWithUpload = async (event) => {
  await handleDrop(event);
};

const handleDeletePdf = async (fileName) => {
  if (!confirm('Are you sure you want to delete this file?')) return;

  try {
    await deletePdf(fileName);
    
    // If the deleted file was selected, clear selection
    if (selectedReport.value && selectedReport.value.name === fileName) {
      selectedReportId.value = '';
    }
  } catch (error) {
    alert('Failed to delete file: ' + (error.message || 'Unknown error'));
  }
};

const handleProcessPdf = async (fileName) => {
  await processPdf(fileName);
};

const handleViewPdf = async (fileName) => {
  try {
    await viewPdf(fileName);
  } catch (error) {
    alert('Failed to download file: ' + (error.message || 'Unknown error'));
  }
};

const handleSummarizeText = async () => {
  const success = await summarizeText(extractedText.value);
  if (success) {
    setActiveTab('analysis');
  }
};

const handleAnalyzeWithOpenAI = async () => {
  const success = await analyzeWithOpenAI(extractedText.value);
  if (success) {
    setActiveTab('analysis');
  }
};

const handleAnalyzeWithGensim = async () => {
  const success = await analyzeWithGensim(extractedText.value);
  if (success) {
    setActiveTab('analysis');
  }
};

const handleAnalyzeWithOllama = async () => {
  console.log('Ollama clicked, extractedText length:', extractedText.value?.length);
  const success = await analyzeWithOllama(extractedText.value);
  if (success) {
    setActiveTab('analysis');
  }
};

const handleAnalyzeWithDeepInfra = async () => {
  console.log('DeepInfra clicked, extractedText length:', extractedText.value?.length);
  const success = await analyzeWithDeepInfra(extractedText.value);
  if (success) {
    setActiveTab('analysis');
  }
};

// Chat methods
const handleSendChatMessage = async () => {
  if (!chatInput.value.trim() || isChatting.value) return;
  
  const message = chatInput.value.trim();
  chatInput.value = ''; // Clear input immediately
  
  // Prepare report context
  const reportContext = {
    extractedText: extractedText.value,
    pdfMetadata: pdfMetadata.value,
    extractedImages: extractedImages.value
  };
  
  await sendChatMessage(message, reportContext);
  
  // Scroll to bottom of chat
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const handleChatKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendChatMessage();
  }
};

// Image gallery methods
const handleOpenImageModal = (imageUrl, index) => {
  openImageModal(imageUrl, index, extractedImages.value);
};

const handleNavigateImage = (direction) => {
  navigateImage(direction, extractedImages.value);
};

// Setup and cleanup
let keyboardCleanup = null;

onMounted(() => {
  // Setup keyboard navigation for image gallery
  keyboardCleanup = setupKeyboardNavigation(extractedImages.value);
  
  // Check the current route to handle redirects from /upload-pdf
  const route = useRoute();
  if (route.path === '/upload-pdf') {
    const router = useRouter();
    router.replace('/analysis');
  }
});

onUnmounted(() => {
  // Clean up keyboard event listener
  if (keyboardCleanup) {
    keyboardCleanup();
  }
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

.btn-auth-outline.text-orange-400:hover:not(:disabled) {
  border-color: #f97316;
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
.max-h-96 {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-96::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
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

/* Use Apple system font on Analysis page */
.font-apple {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px; /* slightly larger base size */
  line-height: 1.45;
}
</style>

<style scoped>
:deep(.tabs-dark) {
  background: rgba(17, 24, 39, 0.6) !important; /* dark slate */
  border-color: #374151 !important; /* md gray */
}

:deep(.tabs-dark) :deep(button) {
  background: transparent !important;
  color: #9ca3af !important; /* gray-400 */
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.5rem !important;
}

:deep(.tabs-dark) :deep(button[aria-selected="true"]) {
  background: #374151 !important; /* gray-700 */
  color: #4ade80 !important; /* green-400 */
  font-weight: 700 !important;
}

:deep(.tabs-dark) :deep(button):hover {
  background: rgba(55,65,81,0.45) !important;
  color: #d1d5db !important;
}
</style>
