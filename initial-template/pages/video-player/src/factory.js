import Camera from "../../../../classes/lib/shared/camera.js"
import { supportsWorkerType } from "../../../../classes/lib/shared/util.js"
import controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

async function getWorker(){
    if (supportsWorkerType ()){
        console.log('suporta');
        const worker = new Worker('./src/worker.js', {type: 'module'})
    return worker
}  
    const workerMock = {
        async postMessage() {},
        onmessage(msg) {}
    }
     console.log('não suporta');
     return workerMock
}
const worker = await getWorker()


const camera = Camera.init()
const [rootPath] = window.location.href.split('/pages/')
const factory = {
  async initialize() {
   return controller.initialize({
      view: new View(),
      camera,
      worker
    })
  }
}

export default factory