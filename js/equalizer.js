window.onload = () => {
    const canvas = document.getElementById("canvas");

    const canvasContext = canvas.getContext('2d');

    const audioContext = new AudioContext();
                //resume audioContext
                if (audioContext.state == 'suspended')
                audioContext.resume();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const bufferLength = analyser.frequencyBinCount;

    const soundKeys = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        let xAxis = 0;
        analyser.getByteFrequencyData(dataArray);

        const gradient = canvasContext.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0,"#F2B691");
        gradient.addColorStop(1,"#FCEEB5");
        canvasContext.fillStyle = gradient;
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 10;
        const barGap = 6;

        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] * 8;

            let r, g, b, a;

            // Colors
            if (dataArray[i] > 200) {
                r = 204;
                g = 83;
                b = 118;
                a = 1;
            }
            else if(dataArray[i]>140){
                r = 238;
                g = 120;
                b = 110;
                a = 1;
            }
            else if(dataArray[i]>100){
                r = 242;
                g = 182;
                b = 145;
                a = 1;
            }
            else if(dataArray[i]>80){
                r = 252;
                g = 238;
                b = 181;
                a = 1;
            }
            else
            {
                r = 241;
                g = 255;
                b = 249;
                a = 1;
            }

            canvasContext.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a +")";
            canvasContext.fillRect(xAxis, canvas.height - barHeight, barWidth, barHeight);
            xAxis += barWidth + barGap;
        }
    }


    document.querySelectorAll("input").forEach(item => {

        let soundKey = {};
        soundKey.key = item.attributes["data-key"].nodeValue;
        soundKey.audio = document.querySelector(`audio[data-key="${soundKey.key}"]`);
        soundKey.audioSrc = audioContext.createMediaElementSource(soundKey.audio);
        soundKeys.push(soundKey);

        item.addEventListener('click', (e) => {
            let keyPressed = e.target.attributes["data-key"].nodeValue;
            let soundKey = soundKeys.find(soundKey => soundKey.key == keyPressed);
            soundKey.audioSrc.connect(analyser);
            analyser.connect(audioContext.destination);

            soundKey.audio.load();
            soundKey.audio.play();

            renderFrame();
        });
    })


};

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

//TO dO:
// 1) add event listener for keypress
