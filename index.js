((context) => {
    let keepRinging = true;
    const audioCtx = new (context.AudioContext || context.webkitAudioContext)();
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0.1;

    context.stop = () => {
        keepRinging = false;
    };

    const createOscillator = (ctx, freq) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          return o;
    };

    const dialBack = (gain) => {
        const tones = [
            createOscillator(audioCtx, 440),
            createOscillator(audioCtx, 480)
        ];
        tones.forEach(o => {
            o.connect(gain);
            o.start(); 
        });

        setTimeout(() => {
            tones.forEach(o => {
                o.stop();
                o.disconnect(gain);
            });
        }, 2000);

    };

    const loop = () => {
        if (!keepRinging) {
            return console.log('STOPPED');
        }
        dialBack(gainNode);
        setTimeout(loop, 6000);
    }

    loop();
})(window);

