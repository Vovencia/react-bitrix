;(function(){
    try {
        window['__ready'](function() {
            const removeScripts = ['appReady', 'hydrateData'];
            for (const scriptId of removeScripts) {
                const script = document.getElementById(scriptId);
                if (script) script.remove();
            }
        });
        window['__ready'](true);
    } catch (e) {
        console.error(e);
    }
})();