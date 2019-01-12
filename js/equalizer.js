const canvas = document.getElementById("canvas");

window.onload = () => {

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096;
    const bufferLength = analyser.frequencyBinCount;

    const soundKeys = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasContext = canvas.getContext('2d');
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        let xAxis = 0;
        analyser.getByteFrequencyData(dataArray);

        canvasContext.fillStyle = "#F1FFF9";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 10;
        const barGap = 6;

        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i] * 2.5;

            let r, g, b;

            // Colors
            if (dataArray[i] > 200) {
                r = 204;
                g = 83;
                b = 118;
            }
            else if(dataArray[i]>140){
                r = 238;
                g = 120;
                b = 110;
            }
            else if(dataArray[i]>100){
                r = 242;
                g = 182;
                b = 145;
            }
            else if(dataArray[i]>80){
                r = 252;
                g = 238;
                b = 181;
            }
            else
            {
                r = 162;
                g = 204;
                b = 182;
            }

            canvasContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
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

            //resume audioContext
            if (audioContext.state == 'suspended')
                audioContext.resume();


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