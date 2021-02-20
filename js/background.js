browser.menus.create({
    id: "Extract Barcode",
    type: "normal",
    title: "Copy Barcode Number",
    contexts: ["image"],
});

browser.menus.onClicked.addListener((info) => {
    extractFromImage(info.srcUrl);
});


function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(function() {
    }, function(err) {
        console.log(err)
    });
}

function extractFromImage(image) {

    const worker = Tesseract.createWorker({
        workerPath: 'js/worker.min.js',
        corePath: 'js/tesseract-core.wasm.js',
        langPath: 'langdata',
        workerBlobURL: false,
        logger: m => console.log(m)
    });

    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789'
        });
        const { data: { text } } = await worker.recognize(image);
        const barcode = text.replace(/\s+/g, '');
        updateClipboard(barcode);
        await worker.terminate();
    })();

}

