// Create pixel transition effect
function createPixelTransition() {
    const container = document.getElementById('pixelTransition');
    const totalBlocks = 400; // 20x20 grid
    
    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.className = 'pixel-block';
        // Random delay for each pixel block
        const delay = Math.random() * 0.8;
        block.style.animationDelay = `${delay}s`;
        container.appendChild(block);
    }
    
    // Remove transition overlay after animation completes
    setTimeout(() => {
        container.style.display = 'none';
    }, 2500);
}

// Initialize transition on page load
window.addEventListener('load', createPixelTransition);
