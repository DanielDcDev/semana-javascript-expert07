export default class Controller {
    #view
    #camera
    #worker
    #blinkCounter = 0
    constructor({view, service, worker ,camera }){
        this.#view = view
        this.#camera = camera
        this.#worker = this.#configuredWOrker(worker)

        this.#view.configureOnBtnClick(this.onBtnStart.bind(this ))
    }
    static async initialize(deps) {
        const controller = new Controller(deps)
        controller.log('not yet detecting eye blink! click in the button to start ')
        return controller.init( )
    }

    #configuredWOrker(worker){
        let ready = false
        worker.onmessage = (data) =>{
            if('READY'=== data.data){
                console.log('worker is ready ');
                this.#view.enableButton()
                ready = true
                return;
            }
            const blinked = data.blinked
            this.#blinkCounter += blinked
            console.log('blinked', blinked);
        }
        return {
            send (msg) {
                if(!ready) return;
                worker.postMessage(msg)
            }
        }
    }
async init() {
    console.log('init');
}

loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log(`detecting eye blink...`)
    setTimeout(() => this.loop(), 100)
  }

log(text){
    this.#view.log(`logger: ${text}`)
}

onBtnStart() {
    this.log('initializing detection...')
    this.#blinkCounter = 0
    this.loop()
}
}