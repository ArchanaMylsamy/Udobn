import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Rect, Circle, Star, Text, Transformer, Path, RegularPolygon } from 'react-konva';

const TShirtCustomizer = () => {
  // State for t-shirt base color
  const [shirtColor, setShirtColor] = useState('#ffffff');
  // State for selected tool
  const [tool, setTool] = useState('select');
  // State for shapes on canvas
  const [shapes, setShapes] = useState([]);
  // State for currently selected shape
  const [selectedId, setSelectedId] = useState(null);
  // State for uploaded images
  const [images, setImages] = useState([]);
  // State for text elements
  const [texts, setTexts] = useState([]);
  // State for current text input
  const [currentText, setCurrentText] = useState('Your Text Here');
  // State for text properties
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  // State for canvas dimensions
  const [stageWidth, setStageWidth] = useState(400);
  const [stageHeight, setStageHeight] = useState(500);

  const [viewSide, setViewSide] = useState('front'); // 'front' or 'back'
const [shirtStyle, setShirtStyle] = useState('regular'); // 'regular', 'crop', or 'baggy'
const [isDrawing, setIsDrawing] = useState(false);
const [lines, setLines] = useState([]);
const [currentLine, setCurrentLine] = useState(null);

// Separate state for front and back designs
const [frontShapes, setFrontShapes] = useState([]);
const [frontImages, setFrontImages] = useState([]);
const [frontTexts, setFrontTexts] = useState([]);
const [frontLines, setFrontLines] = useState([]);
const [backShapes, setBackShapes] = useState([]);
const [backImages, setBackImages] = useState([]);
const [backTexts, setBackTexts] = useState([]);
const [backLines, setBackLines] = useState([]);

  // Refs
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);

  // Color palette options
  const colorPalette = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff'
  ];
 
  // T-shirt path data for different views and styles
const tshirtPaths = {
    front: {
      regular: "M200,50 C230,50 260,55 285,65 L320,80 L300,150 L280,150 L280,300 L120,300 L120,150 L100,150 L80,80 L115,65 C140,55 170,50 200,50 Z M170,50 C180,65 220,65 230,50 Z", // Note the neck cutout
      crop: "M200,50 C230,50 260,55 285,65 L320,80 L300,150 L280,150 L280,200 L120,200 L120,150 L100,150 L80,80 L115,65 C140,55 170,50 200,50 Z M170,50 C180,65 220,65 230,50 Z",
      baggy: "M200,50 C240,50 280,55 315,65 L350,80 L330,150 L310,150 L310,300 L90,300 L90,150 L70,150 L50,80 L85,65 C120,55 160,50 200,50 Z M170,50 C180,65 220,65 230,50 Z"
    },
    back: {
      regular: "M200,50 C230,50 260,55 285,65 L320,80 L300,150 L280,150 L280,300 L120,300 L120,150 L100,150 L80,80 L115,65 C140,55 170,50 200,50 Z",
      crop: "M200,50 C230,50 260,55 285,65 L320,80 L300,150 L280,150 L280,200 L120,200 L120,150 L100,150 L80,80 L115,65 C140,55 170,50 200,50 Z",
      baggy: "M200,50 C240,50 280,55 315,65 L350,80 L330,150 L310,150 L310,300 L90,300 L90,150 L70,150 L50,80 L85,65 C120,55 160,50 200,50 Z"
    }
  };
  
  // T-shirt outline path data - SVG path for a t-shirt shape
  const tshirtPath = "M200,50 C230,50 260,55 285,65 L320,80 L300,150 L280,150 L280,300 L120,300 L120,150 L100,150 L80,80 L115,65 C140,55 170,50 200,50 Z";

// Modified useEffect to properly handle design state based on selected side
useEffect(() => {
    // Set the active shapes, images, texts, and lines based on the current view side
    if (viewSide === 'front') {
      setShapes(frontShapes);
      setImages(frontImages);
      setTexts(frontTexts);
      setLines(frontLines);
    } else {
      setShapes(backShapes);
      setImages(backImages);
      setTexts(backTexts);
      setLines(backLines);
    }
  }, [viewSide, frontShapes, frontImages, frontTexts, frontLines, backShapes, backImages, backTexts, backLines]);
// Add this function to save designs when switching sides
const saveCurrentDesign = () => {
    if (viewSide === 'front') {
      setFrontShapes([...shapes]);
      setFrontImages([...images]);
      setFrontTexts([...texts]);
      setFrontLines([...lines]);
    } else {
      setBackShapes([...shapes]);
      setBackImages([...images]);
      setBackTexts([...texts]);
      setBackLines([...lines]);
    }
  };  

  // Handle window resize
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Make stage responsive but maintain aspect ratio
        if (containerWidth < 400) {
          const scale = containerWidth / 400;
          setStageWidth(containerWidth);
          setStageHeight(500 * scale);
        } else {
          setStageWidth(400);
          setStageHeight(500);
        }
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Update transformer when selected shape changes
  useEffect(() => {
    if (selectedId === null || !transformerRef.current) {
      return;
    }
    
    const stage = stageRef.current;
    const selectedNode = stage.findOne('#' + selectedId);
    
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Handle adding a new shape
  const addShape = (type) => {
    const id = Date.now().toString();
    let newShape = {
      id,
      type,
      x: stageWidth / 2,
      y: stageHeight / 3,
      width: 50,
      height: 50,
      fill: '#ff0000',
      rotation: 0,
      draggable: true
    };
    
    if (type === 'triangle') {
      newShape = {
        ...newShape,
        sides: 3,
        radius: 25
      };
    } else if (type === 'hexagon') {
      newShape = {
        ...newShape,
        sides: 6,
        radius: 25
      };
    } else if (type === 'heart') {
        newShape = {
          ...newShape,
          scaleX: 1,
          scaleY: 1,
          data: "M200,100 C200,50 300,50 300,100 C300,150 200,200 200,250 C200,200 100,150 100,100 C100,50 200,50 200,100 Z"
        };
      }
    
    setShapes([...shapes, newShape]);
    setSelectedId(id);
    setTool('select');
  };

  // Handle adding text
  const addText = () => {
    const id = 'text-' + Date.now().toString();
    const newText = {
      id,
      text: currentText,
      x: stageWidth / 2,
      y: stageHeight / 3,
      fontSize,
      fill: textColor,
      draggable: true,
      rotation: 0
    };
    
    setTexts([...texts, newText]);
    setSelectedId(id);
    setTool('select');
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const id = 'image-' + Date.now().toString();
          const aspectRatio = img.width / img.height;
          
          // Calculate size to fit within t-shirt area
          let width = 100;
          let height = 100 / aspectRatio;
          
          if (width > stageWidth / 2) {
            width = stageWidth / 2;
            height = width / aspectRatio;
          }
          
          if (height > stageHeight / 3) {
            height = stageHeight / 3;
            width = height * aspectRatio;
          }
          
          const newImage = {
            id,
            image: img,
            x: stageWidth / 2 - width / 2,
            y: stageHeight / 3,
            width,
            height,
            draggable: true,
            rotation: 0
          };
          
          setImages(prevImages => [...prevImages, newImage]);
          setSelectedId(id);
          setTool('select');
          
          // Clear the file input to allow uploading the same image again
          e.target.value = '';
        };
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Add drawing functionality
const handleMouseDown = (e) => {
    // Only handle mouse down for drawing if the drawing tool is selected
    if (tool !== 'draw') {
      return;
    }
    
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setCurrentLine({
      id: `line-${Date.now()}`,
      points: [pos.x, pos.y],
      stroke: '#000000',
      strokeWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
    });
  };
  
  const handleMouseMove = (e) => {
    // No drawing - skipping
    if (!isDrawing || tool !== 'draw') {
      return;
    }
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, point.x, point.y]
    });
  };
  
  const handleMouseUp = () => {
    if (!isDrawing || tool !== 'draw') {
      return;
    }
    
    setIsDrawing(false);
    if (currentLine) {
      setLines([...lines, currentLine]);
      setCurrentLine(null);
    }
  };
  
  
  // Change shirt color
  const changeShirtColor = (color) => {
    setShirtColor(color);
  };

  // Add this function to check if either side has been edited
const isDesignSideEdited = (side) => {
    if (side === 'front') {
      return frontShapes.length > 0 || frontImages.length > 0 || frontTexts.length > 0 || frontLines.length > 0;
    } else {
      return backShapes.length > 0 || backImages.length > 0 || backTexts.length > 0 || backLines.length > 0;
    }
  };
  
// Custom popup implementation
// Custom popup implementation with HTML support
const showCustomAlert = (message, options = {}) => {
    const {
      title = 'Alert',
      type = 'info', // info, success, warning, error
      duration = 0, // 0 means it won't auto-close
      onConfirm = null,
      confirmText = 'OK',
      isHTML = false // New parameter to indicate if message contains HTML
    } = options;
    
    // Remove any existing popups
    const existingPopup = document.getElementById('custom-popup-container');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }
    
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.id = 'custom-popup-container';
    popupContainer.style.position = 'fixed';
    popupContainer.style.left = '0';
    popupContainer.style.top = '0';
    popupContainer.style.width = '100%';
    popupContainer.style.height = '100%';
    popupContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
    popupContainer.style.display = 'flex';
    popupContainer.style.alignItems = 'center';
    popupContainer.style.justifyContent = 'center';
    popupContainer.style.zIndex = '1001'; // Higher than other modals
    
    // Popup content
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = 'white';
    popupContent.style.padding = '20px';
    popupContent.style.borderRadius = '8px';
    popupContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popupContent.style.width = '350px';
    popupContent.style.maxWidth = '90%';
    popupContent.style.textAlign = 'center';
    popupContent.style.position = 'relative';
    popupContent.style.maxHeight = '90vh';
    popupContent.style.overflowY = 'auto';
    
    // Close button (X)
    const closeButton = document.createElement('div');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '15px';
    closeButton.style.top = '10px';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#999';
    closeButton.style.lineHeight = '1';
    closeButton.style.zIndex = '2'; // Make sure it's above other content
    closeButton.onclick = () => {
      document.body.removeChild(popupContainer);
    };
    popupContent.appendChild(closeButton);
    
    // Icon based on type
    const iconContainer = document.createElement('div');
    iconContainer.style.marginBottom = '15px';
    
    let iconColor = '#3498db'; // Default blue for info
    let iconContent = 'ℹ️';
    
    if (type === 'success') {
      iconColor = '#2ecc71';
      iconContent = '✓';
    } else if (type === 'warning') {
      iconColor = '#f39c12';
      iconContent = '⚠️';
    } else if (type === 'error') {
      iconColor = '#e74c3c';
      iconContent = '✕';
    }
    
    if (type === 'info' || type === 'success' || type === 'error') {
      const icon = document.createElement('div');
      icon.textContent = iconContent;
      icon.style.display = 'inline-block';
      icon.style.width = '40px';
      icon.style.height = '40px';
      icon.style.borderRadius = '50%';
      icon.style.backgroundColor = iconColor;
      icon.style.color = 'white';
      icon.style.fontSize = type === 'warning' ? '24px' : '26px';
      icon.style.lineHeight = '40px';
      icon.style.textAlign = 'center';
      iconContainer.appendChild(icon);
      popupContent.appendChild(iconContainer);
    } else if (type === 'warning') {
      const icon = document.createElement('div');
      icon.textContent = iconContent;
      icon.style.fontSize = '36px';
      icon.style.lineHeight = '1';
      iconContainer.appendChild(icon);
      popupContent.appendChild(iconContainer);
    }
    
    // Title
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.margin = '0 0 15px 0';
    titleElement.style.fontSize = '18px';
    popupContent.appendChild(titleElement);
    
    // Message
    const messageElement = document.createElement('div'); // Changed from p to div
    messageElement.style.margin = '0 0 20px 0';
    messageElement.style.lineHeight = '1.5';
    messageElement.style.color = '#555';
    
    // Handle HTML or text content
    if (isHTML) {
      messageElement.innerHTML = message; // Set as HTML
    } else {
      messageElement.textContent = message; // Set as plain text
    }
    
    popupContent.appendChild(messageElement);
    
    // Button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = confirmText;
    confirmButton.style.padding = '8px 20px';
    confirmButton.style.backgroundColor = iconColor;
    confirmButton.style.color = 'white';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.fontSize = '14px';
    confirmButton.style.fontWeight = 'bold';
    confirmButton.onclick = () => {
      document.body.removeChild(popupContainer);
      if (onConfirm && typeof onConfirm === 'function') {
        onConfirm();
      }
    };
    
    // Button hover effect
    confirmButton.onmouseover = () => {
      confirmButton.style.opacity = '0.9';
    };
    confirmButton.onmouseout = () => {
      confirmButton.style.opacity = '1';
    };
    
    popupContent.appendChild(confirmButton);
    popupContainer.appendChild(popupContent);
    
    // Add to document
    document.body.appendChild(popupContainer);
    
    // Auto-close timer if duration is set
    if (duration > 0) {
      setTimeout(() => {
        if (document.body.contains(popupContainer)) {
          document.body.removeChild(popupContainer);
        }
      }, duration);
    }
    
    // Ensure the popup is responsive on window resize
    const handleResize = () => {
      // No additional styling needed as we're using percentages and flexbox
    };
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener when popup is closed
    const cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };
    
    // Add event listener for cleanup
    popupContainer.addEventListener('click', (e) => {
      if (e.target === popupContainer) {
        document.body.removeChild(popupContainer);
        cleanup();
      }
    });
    
    return {
      close: () => {
        if (document.body.contains(popupContainer)) {
          document.body.removeChild(popupContainer);
          cleanup();
        }
      }
    };
  };

  const exportDesign = () => {
    // Save the current design first
    saveCurrentDesign();
    
    let isFrontEdited = isDesignSideEdited('front');
    const isBackEdited = isDesignSideEdited('back');
   isFrontEdited = isDesignSideEdited('front');
    // If neither side is edited, show a custom alert instead of the default alert
    if (!isFrontEdited && !isBackEdited) {
      showCustomAlert('Please design at least one side of the T-shirt before submitting.', {
        title: 'Design Required',
        type: 'warning'
      });
      return;
    }
    
    // Set up export options based on which sides are edited
    let exportOptions = [];
    if (isFrontEdited) exportOptions.push('front');
    if (isBackEdited) exportOptions.push('back');
    
    // Modal for export options
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    
    // Modal content
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.padding = '30px';
    content.style.borderRadius = '8px';
    content.style.width = '400px';
    content.style.maxWidth = '90%';
    
    // Header
    const header = document.createElement('h2');
    header.textContent = 'Submit Design Request';
    header.style.marginTop = '0';
    content.appendChild(header);
    
    // Email input
    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Your Email:';
    emailLabel.style.display = 'block';
    emailLabel.style.marginTop = '15px';
    content.appendChild(emailLabel);
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.style.width = '100%';
    emailInput.style.padding = '8px';
    emailInput.style.marginTop = '5px';
    
    emailInput.style.border = '1px solid #ccc';
    emailInput.required = true;
    content.appendChild(emailInput);
    
    // Query input
    const queryLabel = document.createElement('label');
    queryLabel.textContent = 'Additional Requirements:';
    queryLabel.style.display = 'block';
    queryLabel.style.marginTop = '15px';
    content.appendChild(queryLabel);
    
    const queryInput = document.createElement('textarea');
    queryInput.style.width = '100%';
    queryInput.style.padding = '8px';
    queryInput.style.marginTop = '5px';
    queryInput.style.borderRadius = '4px';
    queryInput.style.border = '1px solid #ccc';
    queryInput.style.minHeight = '100px';
    queryInput.placeholder = 'Size, quantity, special instructions, etc.';
    content.appendChild(queryInput);
    
    // Only show side selection if both sides are edited
    if (isFrontEdited && isBackEdited) {
      const sideLabel = document.createElement('label');
      sideLabel.textContent = 'Export Option:';
      sideLabel.style.display = 'block';
      sideLabel.style.marginTop = '15px';
      content.appendChild(sideLabel);
      
      const sideOptions = document.createElement('div');
      sideOptions.style.marginTop = '10px';
      
      const frontOption = document.createElement('label');
      frontOption.style.marginRight = '10px';
      const frontCheckbox = document.createElement('input');
      frontCheckbox.type = 'radio';
      frontCheckbox.name = 'side';
      frontCheckbox.value = 'front';
      frontCheckbox.checked = true;
      frontOption.appendChild(frontCheckbox);
      frontOption.appendChild(document.createTextNode(' Front Only'));
      sideOptions.appendChild(frontOption);
      
      const backOption = document.createElement('label');
      backOption.style.marginRight = '10px';
      const backCheckbox = document.createElement('input');
      backCheckbox.type = 'radio';
      backCheckbox.name = 'side';
      backCheckbox.value = 'back';
      backOption.appendChild(backCheckbox);
      backOption.appendChild(document.createTextNode(' Back Only'));
      sideOptions.appendChild(backOption);
      
      const bothOption = document.createElement('label');
      const bothCheckbox = document.createElement('input');
      bothCheckbox.type = 'radio';
      bothCheckbox.name = 'side';
      bothCheckbox.value = 'both';
      bothOption.appendChild(bothCheckbox);
      bothOption.appendChild(document.createTextNode(' Both Sides'));
      sideOptions.appendChild(bothOption);
      
      content.appendChild(sideOptions);
    } else {
      // Add suggestion message if only one side is designed
      const suggestionMsg = document.createElement('p');
      suggestionMsg.style.marginTop = '15px';
      suggestionMsg.style.color = '#e67e22';
      suggestionMsg.textContent = !isFrontEdited 
        ? 'Note: You have only designed the back side. Would you like to design the front too?' 
        : 'Note: You have only designed the front side. Would you like to design the back too?';
      content.appendChild(suggestionMsg);
    }
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginTop = '25px';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.backgroundColor = '#e0e0e0';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.onclick = () => {
      document.body.removeChild(modal);
    };
    buttonContainer.appendChild(cancelButton);
    
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Request';
    submitButton.style.padding = '10px 20px';
    submitButton.style.backgroundColor = '#4CAF50';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.borderRadius = '4px';
    submitButton.style.cursor = 'pointer';
    submitButton.onclick = () => {
      if (!emailInput.value.trim()) {
        // Replace default alert with custom popup
        showCustomAlert('Please enter your email address.', {
          title: 'Email Required',
          type: 'error'
        });
        return;
      }
      
      // Determine which sides to export
      let sidesToExport = [];
      if (isFrontEdited && isBackEdited) {
        const selectedOption = document.querySelector('input[name="side"]:checked').value;
        if (selectedOption === 'both') {
          sidesToExport = ['front', 'back'];
        } else {
          sidesToExport = [selectedOption];
        }
      } else {
        sidesToExport = isFrontEdited ? ['front'] : ['back'];
      }
      
      // Process the export
      const exportImages = [];
      let currentSideIndex = 0;
      
      const processNextSide = () => {
        if (currentSideIndex < sidesToExport.length) {
          const side = sidesToExport[currentSideIndex];
          
          // Save current design state
          const currentSide = viewSide;
          saveCurrentDesign();
          
          // Switch to the side we want to export
          setViewSide(side);
          
          // Use setTimeout to ensure the view has updated
          setTimeout(() => {
            if (stageRef.current) {
              const prevSelectedId = selectedId;
              setSelectedId(null);
              
              // Use another setTimeout to ensure selection is cleared
              setTimeout(() => {
                const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
                exportImages.push({ side, dataURL });
                
                // Restore selection if needed
                setSelectedId(prevSelectedId);
                
                // Move to next side
                currentSideIndex++;
                processNextSide();
              }, 100);
            }
          }, 300);
        } else {
          // All sides processed, show confirmation
          document.body.removeChild(modal);
          
          // Build HTML for thumbnails
          let thumbnailsHTML = '<div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px; flex-wrap: wrap;">';
          
          exportImages.forEach(img => {
            thumbnailsHTML += `
              <div style="text-align: center; margin: 5px;">
                <img src="${img.dataURL}" style="width: 150px; height: auto; border: 1px solid #ccc; border-radius: 4px;">
                <p style="margin: 5px 0 0 0; font-weight: bold;">${img.side === 'front' ? 'Front' : 'Back'}</p>
              </div>
            `;
          });
          
          thumbnailsHTML += '</div>';
          thumbnailsHTML += `<p style="margin-top: 15px;">Your design request has been sent to ${emailInput.value}. We'll get back to you soon.</p>`;
          
          // Use the custom alert with HTML
          const confirmPopup = showCustomAlert(thumbnailsHTML, {
            title: 'Design Request Submitted!',
            type: 'success',
            confirmText: 'Close',
            isHTML: true, // Important: set this to true for HTML content
            onConfirm: () => {
              // For demonstration: offer direct download of images
              exportImages.forEach(img => {
                const link = document.createElement('a');
                link.download = `custom-tshirt-${img.side}.png`;
                link.href = img.dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            }
          });
        }
      };
      // Start processing
      processNextSide();
    };
    buttonContainer.appendChild(submitButton);
    
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
  };
  // Delete selected element
  const handleDelete = () => {
    if (selectedId) {
      if (selectedId.startsWith('text-')) {
        setTexts(texts.filter(text => text.id !== selectedId));
      } else if (selectedId.startsWith('image-')) {
        setImages(images.filter(img => img.id !== selectedId));
      } else {
        setShapes(shapes.filter(shape => shape.id !== selectedId));
      }
      setSelectedId(null);
    }
  };

// Helper function to convert line points to SVG path
const lineToSvgPath = (points) => {
    if (!points || points.length < 2) return '';
    
    let path = `M ${points[0]} ${points[1]}`;
    for (let i = 2; i < points.length; i += 2) {
      path += ` L ${points[i]} ${points[i + 1]}`;
    }
    return path;
  };

// Helper function to offset points for draggable paths
const offsetPoints = (points, x, y) => {
    // Calculate center of points
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    
    for (let i = 0; i < points.length; i += 2) {
      minX = Math.min(minX, points[i]);
      maxX = Math.max(maxX, points[i]);
      minY = Math.min(minY, points[i + 1]);
      maxY = Math.max(maxY, points[i + 1]);
    }
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Apply offset to all points
    const newPoints = [];
    for (let i = 0; i < points.length; i += 2) {
      newPoints.push(
        points[i] - centerX + x,
        points[i + 1] - centerY + y
      );
    }
    
    return newPoints;
  };

  // Key event handlers for delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 46 || e.keyCode === 8) { // Delete or Backspace
        handleDelete();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  // Check if element is within t-shirt boundary
  const isWithinTshirtBounds = (x, y, width, height) => {
    // Simple bounding box check - this could be improved with more precise path checking
    if (x < 100 || x + width > stageWidth - 100 || y < 80 || y + height > stageHeight - 50) {
      return false;
    }
    return true;
  };

  return (
    <div className="tshirt-customizer">
        
      <div className="customizer-container" style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Customize your own T-Shirt</h1>
        
        <div className="editor-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
          {/* Canvas area */}
          
          <div 
            className="canvas-container" 
            style={{ flex: '1', minWidth: '300px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
            ref={containerRef}
          >
            {/* Add T-shirt view and style selection UI */}
<div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
  <div>
    <h3>View Side</h3>
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button 
        onClick={() => {
          saveCurrentDesign();
          setViewSide('front');
        }}
        style={{ 
          padding: '8px 12px',
          backgroundColor: viewSide === 'front' ? '#000000' : '#e0e0e0',
          color: viewSide === 'front' ? 'white' : 'black',
          border: 'none',
          
          cursor: 'pointer'
        }}
      >
        Front
      </button>
      <button 
        onClick={() => {
          saveCurrentDesign();
          setViewSide('back');
        }}
        style={{ 
          padding: '8px 12px',
          backgroundColor: viewSide === 'back' ? '#000000' : '#e0e0e0',
          color: viewSide === 'back' ? 'white' : 'black',
          border: 'none',
          
          cursor: 'pointer'
        }}
      >
        Back
      </button>
    </div>
  </div>
  
  <div>
    <h3>T-Shirt Style</h3>
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button 
        onClick={() => setShirtStyle('regular')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: shirtStyle === 'regular' ? '#000000' : '#e0e0e0',
          color: shirtStyle === 'regular' ? 'white' : 'black',
          border: 'none',
          
          cursor: 'pointer'
        }}
      >
        Regular
      </button>
      <button 
        onClick={() => setShirtStyle('crop')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: shirtStyle === 'crop' ? '#000000' : '#e0e0e0',
          color: shirtStyle === 'crop' ? 'white' : 'black',
          border: 'none',
         
          cursor: 'pointer'
        }}
      >
        Crop Top
      </button>
      <button 
        onClick={() => setShirtStyle('baggy')}
        style={{ 
          padding: '8px 12px',
          backgroundColor: shirtStyle === 'baggy' ? '#000000' : '#e0e0e0',
          color: shirtStyle === 'baggy' ? 'white' : 'black',
          border: 'none',
          
          cursor: 'pointer'
        }}
      >
        Baggy
      </button>
    </div>
  </div>
</div>
            <div style={{ position: 'relative', width: '100%', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <Stage
                width={stageWidth}
                height={stageHeight}
                ref={stageRef}
                onMouseDown={(e) => {
                    // Deselect when clicking on empty area
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                    setSelectedId(null);
                    }
                    handleMouseDown(e);
                }}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
            >
                <Layer>

                {lines.map((line, i) => (
  <Path
    key={line.id}
    id={line.id}
    data={lineToSvgPath(line.points)}
    stroke={line.stroke}
    strokeWidth={line.strokeWidth}
    lineCap={line.lineCap}
    lineJoin={line.lineJoin}
    onClick={() => setSelectedId(line.id)}
    onTap={() => setSelectedId(line.id)}
    draggable={true}
    onDragEnd={(e) => {
      const updatedLines = lines.map(l => {
        if (l.id === line.id) {
          return { 
            ...l, 
            points: offsetPoints(l.points, e.target.x(), e.target.y()) 
          };
        }
        return l;
      });
      setLines(updatedLines);
    }}
  />
))}

{currentLine && (
  <Path
    data={lineToSvgPath(currentLine.points)}
    stroke={currentLine.stroke}
    strokeWidth={currentLine.strokeWidth}
    lineCap={currentLine.lineCap}
    lineJoin={currentLine.lineJoin}
  />
)}


                  {/* T-shirt template */}
                 
                    <Path
                    data={tshirtPaths[viewSide][shirtStyle]}
                    fill={shirtColor}
                    stroke="#000000"
                    strokeWidth={1}
                    />
                  
                  {/* Render shapes */}
                  {shapes.map((shape) => {
                    if (shape.type === 'rectangle') {
                      return (
                        <Rect
                          key={shape.id}
                          id={shape.id}
                          x={shape.x}
                          y={shape.y}
                          width={shape.width}
                          height={shape.height}
                          fill={shape.fill}
                          rotation={shape.rotation}
                          draggable={shape.draggable}
                          onClick={() => setSelectedId(shape.id)}
                          onTap={() => setSelectedId(shape.id)}
                          onDragEnd={(e) => {
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return { ...s, x: e.target.x(), y: e.target.y() };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  width: node.width() * node.scaleX(),
                                  height: node.height() * node.scaleY(),
                                  rotation: node.rotation()
                                };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                        />
                      );
                    }else if (shape.type === 'triangle' || shape.type === 'hexagon') {
                        return (
                          <RegularPolygon
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            sides={shape.sides}
                            radius={shape.radius}
                            fill={shape.fill}
                            rotation={shape.rotation}
                            draggable={shape.draggable}
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => {
                              const updatedShapes = shapes.map(s => {
                                if (s.id === shape.id) {
                                  return { ...s, x: e.target.x(), y: e.target.y() };
                                }
                                return s;
                              });
                              setShapes(updatedShapes);
                            }}
                            onTransformEnd={(e) => {
                              const node = e.target;
                              const scaleX = node.scaleX();
                              const updatedShapes = shapes.map(s => {
                                if (s.id === shape.id) {
                                  return {
                                    ...s,
                                    x: node.x(),
                                    y: node.y(),
                                    radius: node.radius() * scaleX,
                                    rotation: node.rotation()
                                  };
                                }
                                return s;
                              });
                              setShapes(updatedShapes);
                            }}
                          />
                        );
                      }
                     else if (shape.type === 'circle') {
                      return (
                        <Circle
                          key={shape.id}
                          id={shape.id}
                          x={shape.x}
                          y={shape.y}
                          radius={shape.width / 2}
                          fill={shape.fill}
                          rotation={shape.rotation}
                          draggable={shape.draggable}
                          onClick={() => setSelectedId(shape.id)}
                          onTap={() => setSelectedId(shape.id)}
                          onDragEnd={(e) => {
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return { ...s, x: e.target.x(), y: e.target.y() };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            const scaleX = node.scaleX();
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  width: node.width() * scaleX,
                                  height: node.height() * scaleX,
                                  rotation: node.rotation()
                                };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                        />
                      );
                    } else if (shape.type === 'star') {
                      return (
                        <Star
                          key={shape.id}
                          id={shape.id}
                          x={shape.x}
                          y={shape.y}
                          numPoints={5}
                          innerRadius={shape.width / 4}
                          outerRadius={shape.width / 2}
                          fill={shape.fill}
                          rotation={shape.rotation}
                          draggable={shape.draggable}
                          onClick={() => setSelectedId(shape.id)}
                          onTap={() => setSelectedId(shape.id)}
                          onDragEnd={(e) => {
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return { ...s, x: e.target.x(), y: e.target.y() };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            const scaleX = node.scaleX();
                            const updatedShapes = shapes.map(s => {
                              if (s.id === shape.id) {
                                return {
                                  ...s,
                                  x: node.x(),
                                  y: node.y(),
                                  width: node.width() * scaleX,
                                  height: node.height() * scaleX,
                                  rotation: node.rotation()
                                };
                              }
                              return s;
                            });
                            setShapes(updatedShapes);
                          }}
                        />
                      );
                    }else if (shape.type === 'heart') {
                        return (
                          <Path
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            data={shape.data}
                            fill={shape.fill}
                            scaleX={shape.scaleX}
                            scaleY={shape.scaleY}
                            rotation={shape.rotation}
                            draggable={shape.draggable}
                            onClick={() => setSelectedId(shape.id)}
                            onTap={() => setSelectedId(shape.id)}
                            onDragEnd={(e) => {
                              const updatedShapes = shapes.map(s => {
                                if (s.id === shape.id) {
                                  return { ...s, x: e.target.x(), y: e.target.y() };
                                }
                                return s;
                              });
                              setShapes(updatedShapes);
                            }}
                            onTransformEnd={(e) => {
                              const node = e.target;
                              const updatedShapes = shapes.map(s => {
                                if (s.id === shape.id) {
                                  return {
                                    ...s,
                                    x: node.x(),
                                    y: node.y(),
                                    scaleX: node.scaleX(),
                                    scaleY: node.scaleY(),
                                    rotation: node.rotation()
                                  };
                                }
                                return s;
                              });
                              setShapes(updatedShapes);
                            }}
                          />
                        );
                      }
                    return null;
                  })}
                  
                  {/* Render uploaded images */}
                  {images.map((img) => (
                    <Image
                      key={img.id}
                      id={img.id}
                      image={img.image}
                      x={img.x}
                      y={img.y}
                      width={img.width}
                      height={img.height}
                      draggable={img.draggable}
                      rotation={img.rotation}
                      onClick={() => setSelectedId(img.id)}
                      onTap={() => setSelectedId(img.id)}
                      onDragEnd={(e) => {
                        const updatedImages = images.map(i => {
                          if (i.id === img.id) {
                            return { ...i, x: e.target.x(), y: e.target.y() };
                          }
                          return i;
                        });
                        setImages(updatedImages);
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const updatedImages = images.map(i => {
                          if (i.id === img.id) {
                            return {
                              ...i,
                              x: node.x(),
                              y: node.y(),
                              width: node.width() * node.scaleX(),
                              height: node.height() * node.scaleY(),
                              rotation: node.rotation()
                            };
                          }
                          return i;
                        });
                        setImages(updatedImages);
                      }}
                    />
                  ))}
                  
                  {/* Render text elements */}
                  {texts.map((textNode) => (
                    <Text
                      key={textNode.id}
                      id={textNode.id}
                      text={textNode.text}
                      x={textNode.x}
                      y={textNode.y}
                      fontSize={textNode.fontSize}
                      fill={textNode.fill}
                      draggable={textNode.draggable}
                      rotation={textNode.rotation}
                      onClick={() => setSelectedId(textNode.id)}
                      onTap={() => setSelectedId(textNode.id)}
                      onDragEnd={(e) => {
                        const updatedTexts = texts.map(t => {
                          if (t.id === textNode.id) {
                            return { ...t, x: e.target.x(), y: e.target.y() };
                          }
                          return t;
                        });
                        setTexts(updatedTexts);
                      }}
                      onTransformEnd={(e) => {
                        const node = e.target;
                        const updatedTexts = texts.map(t => {
                          if (t.id === textNode.id) {
                            return {
                              ...t,
                              x: node.x(),
                              y: node.y(),
                              fontSize: node.fontSize() * node.scaleX(),
                              rotation: node.rotation()
                            };
                          }
                          return t;
                        });
                        setTexts(updatedTexts);
                      }}
                    />
                  ))}
                  
                  {/* Transformer for selected elements */}
                  {selectedId && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit resizing to avoid getting too small
                        if (newBox.width < 5 || newBox.height < 5) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button 
            onClick={exportDesign} 
            style={{ 
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
            }}
            >
            Submit Design Request
            </button>

              
              {selectedId && (
                <button 
                  onClick={handleDelete} 
                  style={{ 
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '10px'
                  }}
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>
          
          {/* Tools panel */}
          <div className="tools-panel" style={{ flex: '1', minWidth: '300px', backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
            
            <h2 style={{ marginBottom: '15px' }}>Customization Tools</h2>
            
            {/* T-shirt color selection */}
            <div className="color-picker" style={{ marginBottom: '20px' }}>
              <h3>T-Shirt Color</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {colorPalette.map((color) => (
                  <div 
                    key={color}
                    onClick={() => changeShirtColor(color)}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: color,
                      border: shirtColor === color ? '3px solid #333' : '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
              <input 
                type="color" 
                value={shirtColor} 
                onChange={(e) => changeShirtColor(e.target.value)} 
                style={{ marginTop: '10px', width: '100%' }}
              />
            </div>
            
           {/* Add drawing tool button to the shape tools section */}
<div className="shape-tools" style={{ marginBottom: '20px' }}>
  <h3>Add Shapes</h3>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
    
    <button 
      onClick={() => addShape('rectangle')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Rectangle
    </button>
    <button 
      onClick={() => addShape('circle')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Circle
    </button>
    <button 
      onClick={() => addShape('star')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Star
    </button>
    <button 
      onClick={() => addShape('triangle')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Triangle
    </button>
    <button 
      onClick={() => addShape('hexagon')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Hexagon
    </button>
    <button 
      onClick={() => addShape('heart')}
      style={{ 
        padding: '8px 12px',
        backgroundColor: '#000000',
        color: 'white',
        border: 'none',
        
        cursor: 'pointer'
      }}
    >
      Heart
    </button>
  </div>
</div>

 {/* Shape color if shape is selected */}
 {selectedId && !selectedId.startsWith('text-') && !selectedId.startsWith('image-') && (
              <div className="shape-color" style={{ marginBottom: '20px' }}>
                <h3>Shape Color</h3>
                <input 
                  type="color" 
                  value={shapes.find(s => s.id === selectedId)?.fill || '#ff0000'} 
                  onChange={(e) => {
                    const updatedShapes = shapes.map(s => {
                      if (s.id === selectedId) {
                        return { ...s, fill: e.target.value };
                      }
                      return s;
                    });
                    setShapes(updatedShapes);
                  }}
                  style={{ marginTop: '10px', width: '50%' }}
                />
              </div>
            )}
            
            {/* Image upload */}
            <div className="image-upload" style={{ marginBottom: '20px' }}>
              <h3>Upload Image</h3>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ marginTop: '10px', width: '100%' }}
              />
            </div>
            
            {/* Text tools */}
            <div className="text-tools" style={{ marginBottom: '20px' }}>
              <h3>Add Text</h3>
              <div style={{ marginTop: '10px' }}>
                <input 
                  type="text" 
                  value={currentText} 
                  onChange={(e) => setCurrentText(e.target.value)}
                  style={{ 
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    
                    border: '1px solid #ccc'
                  }}
                />
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: '1' }}>
                    <label>Font Size:</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="60" 
                      value={fontSize} 
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  <div style={{ flex: '1' }}>
                    <label>Color:</label>
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                
                <button 
                  onClick={addText}
                  style={{ 
                    padding: '8px 12px',
                    backgroundColor: '#000000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Add Text
                </button>
              </div>
            </div>
            
           
            
            {/* Text properties if text is selected */}
            {selectedId && selectedId.startsWith('text-') && (
              <div className="text-properties" style={{ marginBottom: '20px' }}>
                <h3>Text Properties</h3>
                <div style={{ marginTop: '10px' }}>
                  <label>Text Content:</label>
                  <input 
                    type="text" 
                    value={texts.find(t => t.id === selectedId)?.text || ''} 
                    onChange={(e) => {
                      const updatedTexts = texts.map(t => {
                        if (t.id === selectedId) {
                          return { ...t, text: e.target.value };
                        }
                        return t;
                      });
                      setTexts(updatedTexts);
                    }}
                    style={{ 
                      width: '100%',
                      padding: '8px',
                      marginBottom: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ flex: '1' }}>
                      <label>Font Size:</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="60" 
                        value={texts.find(t => t.id === selectedId)?.fontSize || 20} 
                        onChange={(e) => {
                          const updatedTexts = texts.map(t => {
                            if (t.id === selectedId) {
                              return { ...t, fontSize: parseInt(e.target.value) };
                            }
                            return t;
                          });
                          setTexts(updatedTexts);
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                    
                    <div style={{ flex: '1' }}>
                      <label>Color:</label>
                      <input 
                        type="color" 
                        value={texts.find(t => t.id === selectedId)?.fill || '#000000'} 
                        onChange={(e) => {
                          const updatedTexts = texts.map(t => {
                            if (t.id === selectedId) {
                              return { ...t, fill: e.target.value };
                            }
                            return t;
                          });
                          setTexts(updatedTexts);
                        }}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="instructions" style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
              <h3>Instructions</h3>
              <ul style={{ marginLeft: '20px' }}>
                <li>Select an item to move, resize, or delete it</li>
                <li>Change t-shirt color using the color picker</li>
                <li>Add shapes, text, or upload images</li>
                <li>Customize properties of selected items</li>
                <li>Press Delete key to remove selected items</li>
                <li>Export your design when finished</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TShirtCustomizer;