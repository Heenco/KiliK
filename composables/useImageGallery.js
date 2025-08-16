import { ref, onMounted, onUnmounted } from 'vue'

export const useImageGallery = () => {
  // State
  const selectedImage = ref(null)
  const selectedImageIndex = ref(0)

  // Open image modal
  const openImageModal = (imageUrl, index, images = []) => {
    console.log('openImageModal called with:', imageUrl, index)
    selectedImage.value = imageUrl
    selectedImageIndex.value = index
  }

  // Navigate through images
  const navigateImage = (direction, images = []) => {
    if (images.length === 0) return
    
    if (direction === 'next') {
      selectedImageIndex.value = (selectedImageIndex.value + 1) % images.length
    } else {
      selectedImageIndex.value = selectedImageIndex.value === 0 
        ? images.length - 1 
        : selectedImageIndex.value - 1
    }
    
    selectedImage.value = images[selectedImageIndex.value]
  }

  // Close image modal
  const closeImageModal = () => {
    selectedImage.value = null
    selectedImageIndex.value = 0
  }

  // Keyboard navigation handler
  const handleKeyPress = (event, images = []) => {
    if (!selectedImage.value) return
    
    if (event.key === 'ArrowLeft') {
      navigateImage('prev', images)
    } else if (event.key === 'ArrowRight') {
      navigateImage('next', images)
    } else if (event.key === 'Escape') {
      closeImageModal()
    }
  }

  // Create keyboard handler with images bound
  const createKeyboardHandler = (images) => {
    return (event) => handleKeyPress(event, images)
  }

  // Setup keyboard navigation
  const setupKeyboardNavigation = (images) => {
    const handler = createKeyboardHandler(images)
    document.addEventListener('keydown', handler)
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }

  return {
    // State
    selectedImage,
    selectedImageIndex,
    
    // Methods
    openImageModal,
    navigateImage,
    closeImageModal,
    handleKeyPress,
    setupKeyboardNavigation,
    createKeyboardHandler
  }
}
