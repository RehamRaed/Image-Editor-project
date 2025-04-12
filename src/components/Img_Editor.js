import React, { useRef, useState } from "react";
import styled from "styled-components";

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 50,
    contrast: 100,
    grayscale: 0,
    blur: 0,
    rotate: 0,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result);
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        drawImageOnCanvas(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const drawImageOnCanvas = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const maxWidth = 500;
    const maxHeight = 500;
  
   
    const imgWidth = img.width;
    const imgHeight = img.height;
  
    
    let width = imgWidth;
    let height = imgHeight;
  
   
    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const widthRatio = maxWidth / imgWidth;
      const heightRatio = maxHeight / imgHeight;
      const ratio = Math.min(widthRatio, heightRatio); 
  
      width = imgWidth * ratio;
      height = imgHeight * ratio;
    }
  
    canvas.width = width;
    canvas.height = height;
  

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      blur(${filters.blur}px)
    `;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((filters.rotate * Math.PI) / 360);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: parseFloat(value) };

    setFilters(newFilters);

    if (imageFile) {
      const img = new Image();
      img.src = imageFile;
      img.onload = () => {
        drawImageOnCanvas(img);
      };
    }
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);  
  
    setFilters({
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      blur: 0,
      rotate: 0,
    });
  };

  return (
    <Container>
      <FileInput type="file" onChange={handleImageUpload} />
      <Canvas ref={canvasRef}></Canvas>

      <Controls>
        <Control>
          <Label>Brightness</Label>
          <RangeInput
            type="range"
            name="brightness"
            min="0"
            max="200"
            value={filters.brightness}
            onChange={handleChange}
          />
        </Control>

        <Control>
          <Label>Contrast</Label>
          <RangeInput
            type="range"
            name="contrast"
            min="0"
            max="200"
            value={filters.contrast}
            onChange={handleChange}
          />
        </Control>

        <Control>
          <Label>Grayscale</Label>
          <RangeInput
            type="range"
            name="grayscale"
            min="0"
            max="100"
            value={filters.grayscale}
            onChange={handleChange}
          />
        </Control>

        <Control>
          <Label>Blur</Label>
          <RangeInput
            type="range"
            name="blur"
            min="0"
            max="10"
            value={filters.blur}
            onChange={handleChange}
          />
        </Control>

        <Control>
          <Label>Rotate</Label>
          <RangeInput
            type="range"
            name="rotate"
            min="0"
            max="360"
            value={filters.rotate}
            onChange={handleChange}
          />
        </Control>
      </Controls>

      <SaveButton onClick={handleSave}>Save Image</SaveButton>
    </Container>
  );
};

export default ImageEditor;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
`;

const Canvas = styled.canvas`
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
`;

const Control = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const RangeInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #ddd;
  outline: none;
  border-radius: 5px;
  transition: background 0.3s;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #45a049;
  }
`;
