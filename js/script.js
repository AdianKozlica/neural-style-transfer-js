const first = document.querySelector("#first");
const second = document.querySelector("#second");
const output = document.querySelector("#output");
const firstImage = document.querySelector("#first-image");
const secondImage = document.querySelector("#second-image");
const model = new mi.ArbitraryStyleTransferNetwork();
const canvas = document.getElementById('stylized');
const ctx = canvas.getContext('2d');

function setImgHoverInfo(element,event,text) {
    element.addEventListener(event,() => {
        element.alt = text;
    });
}

function extractImageChange(inputElement,imageElement) {
    inputElement.addEventListener("change",(e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            imageElement.src = fileReader.result;
        };
    });
}

const hoverInfo = [
    [first,"mouseover","Click here"],
    [second,"mouseover","Click here"],
    [output,"mouseover","Submit"],
    [first,"mouseleave","Input"],
    [second,"mouseleave","Style"],
    [output,"mouseleave","Output"],
];

hoverInfo.forEach(item => {
    const [element,event,text] = item;
    
    element.addEventListener(event,() => {
        element.alt = text;
    });
});

const inputElements = [[firstImage,first],[secondImage,second]];

inputElements.forEach(item => {
    const [input,img] = item;
    
    img.addEventListener("click",() => {
        input.click();
    });

    extractImageChange(input,img);
});

output.addEventListener("click",() => {
    model.initialize().then(() => {
        stylize();
    });
});

async function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function stylize() {
    await clearCanvas();
     
    // Resize the canvas to be the same size as the source image.
    canvas.width = output.width;
    canvas.height = output.height;
     
    // This does all the work!
    model.stylize(first, second).then((imageData) => {
      ctx.putImageData(imageData, 0, 0);
      output.src = canvas.toDataURL();
    });
  }