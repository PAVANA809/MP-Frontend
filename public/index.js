import {ModelLoader} from './tfmodel.js'

const m = new ModelLoader();
let model;
(async function () {
  model =await m.load_model();
})();

var bar1 = document.getElementById("abnormalBar");
var bar2 = document.getElementById("normalBar");
function makeprogress(p) {
    bar1.style.width = p[0]*100 + "%";
    bar1.innerHTML = p[0]*100 + "%";
    bar2.style.width = p[1]*100 + "%";
    bar2.innerHTML = p[1]*100 + "%";
}


var deque = [];
var frame
var indices = [
  tf.tensor1d([0],"int32"),
  tf.tensor1d([1],"int32"),
  tf.tensor1d([2],"int32"),
  ];
var centeredRGB

var btn = document.getElementById("cbtn")
btn.addEventListener("click",connectCam)

function connectCam() {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    vendorUrl = window.URL || window.webkitURL;
    
    navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
    navigator.getMedia(
      {
        video: true,
        audio: false,
      },
      function (stream) {
        video.srcObject = stream;
      },
      function (error) {
       console.log(error)
      }
    );
    video.addEventListener("play",function () {
      draw(this, context, 400, 300);
      },false);

    async function draw(video,context,width,height) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video,0,0,width,height);
      frame = context.getImageData(0,0,video.videoWidth,video.videoHeight);
      var tensor = tf.browser.fromPixels(frame)
        .resizeNearestNeighbor([224,224]).toFloat();

      
      centeredRGB = {
        red: tf.gather(tensor,indices[0],2).div(tf.scalar(255)).reshape([50176]),
        green: tf.gather(tensor,indices[1],2).div(tf.scalar(255)).reshape([50176]),
        blue: tf.gather(tensor,indices[2],2).div(tf.scalar(255)).reshape([50176]),
      }
      
      var ptensor = tf.stack([centeredRGB.red,centeredRGB.green,centeredRGB.blue ],1)
      .reshape([224,224,3])
      deque.push(await ptensor.array())
          if(deque.length == 20){
            let ten = tf.tensor(deque)
            // ten = ten.expandDims(0)
            // let prediction = model.predict(ten).dataSync()
            makeprogress(model.predict(ten.expandDims(0)).dataSync())
            // console.log(prediction)
            deque.shift()
          }
      setTimeout(draw,200,video,context,width,height)
    }
}

