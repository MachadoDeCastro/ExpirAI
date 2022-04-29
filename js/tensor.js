// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./models/";

let model, webcam, labelContainer, maxPredictions;

// carrega o modelo e atualiza a webcam
async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // carrega o modelo e o metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
        // labels das classes
        labelContainer.appendChild(document.createElement('div'));
    }
}

//Inicializa o Video
async function initVideo() {    
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam 
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loopVideo);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}


//loop para o Video
async function loopVideo() {
    webcam.update(); // atualiza os frames da camera
    await predictVideo();
    window.requestAnimationFrame(loopVideo);
}

// predicao da Imagem
async function predict() {
    // predict can take in an image, video or canvas html element
    var image = document.getElementById('imagePreview');
    const prediction = await model.predict(image, false);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > 0.8) {
            const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2) * 100 + " %";
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
        else {
            labelContainer.childNodes[i].innerHTML = "";  
        }
    }
}

//Predict Video
async function predictVideo() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > 0.8) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2) * 100 + " %";
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }   
        else {
            labelContainer.childNodes[i].innerHTML = "";  
        }
    }
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').attr('src', e.target.result);
            // $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
        init().then(() => {
            predict();
        });
    }
}
$('#imageUpload').change(function () {
    readURL(this);
});