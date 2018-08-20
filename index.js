((context, gainCut) => {
    const audio = new (context.AudioContext || context.webkitAudioContext)();
    const gain = audio.createGain();
    const tones = [];
    gain.connect(audio.destination);
    gain.gain.value = typeof gainCut !== 'undefined' ? gainCut : 0.1;

    const createOscillator = (ctx, freq) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          return o;
    };

    const dialBack = () => {
        createDualTone(440, 480);
        setTimeout(clearTones, 2000);
    };

    const playTones = () => {
        tones.forEach(o => {
            o.connect(gain);
            o.start();
        });
    };

    const clearTones = () => {
        tones.forEach(o => {
            o.stop();
            o.disconnect(gain);
        });
        tones.length = 0;
    };

    const createDualTone = (lof, hif) => {
        tones.push(createOscillator(audio, lof));
        tones.push(createOscillator(audio, hif));
        playTones();
    };

    const bindNumber = (number, lof, hif) => {
        const n = document.querySelector(`.number[data-number="${number}"]`);
        n.addEventListener('mousedown', createDualTone.bind(context, lof, hif))
        n.addEventListener('mouseup', clearTones);
    };


    [
        [1, 697, 1209],
        [2, 697, 1336],
        [3, 697, 1477],
        [4, 770, 1209],
        [5, 770, 1336],
        [6, 770, 1477],
        [7, 852, 1209],
        [8, 852, 1336],
        [9, 852, 1477],
        ['*', 941, 1209],
        [0, 941, 1336],
        ['#', 941, 1477]
    ].forEach(([n, l, h]) => bindNumber(n, l, h));
})(window);

