// const tf = require("@tensorflow/tfjs")
// import * as tf from '@tensorflow/tfjs';

class ModelLoader{
   constructor() {}
    async load_model() {
        const model = await tf.loadLayersModel(
          "https://firebasestorage.googleapis.com/v0/b/ml-api-87a8e.appspot.com/o/model.json?alt=media&token=1c054e2f-c80f-4e91-ac4d-17854466b84b"
        );
        // console.log(model);
        document.getElementById("progress-bar").style.display = 'none';
        document.getElementById("pbarText").innerHTML = "Model Loaded Successfully";
    return model;
  };
}
export {ModelLoader}
