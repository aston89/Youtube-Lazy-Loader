// ==UserScript==
// @name         YouTube Lazy Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improves player and video loading time by deferring the loading of secondary elements of the page and UI   
// @author       aston89
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Intercetta fetch pesanti e le mette in coda
    const originalFetch = window.fetch;
    const lazyQueue = [];

    window.fetch = function() {
        const url = arguments[0];
        if(typeof url === 'string' && (
            url.includes('/comment/') || 
            url.includes('/next') || 
            url.includes('log_event') // eventi di tracking
        )) {
            lazyQueue.push(() => originalFetch.apply(this, arguments));
            return new Promise(() => {}); // blocca temporaneamente
        }
        return originalFetch.apply(this, arguments);
    };

    // Funzione helper: lazy-load per nodi visibili
    function lazyLoadNode(node) {
        if(!node || node.dataset.loaded) return;
        node.dataset.loaded = 'true';

        // Attiva fetch in coda quando nodo entra in viewport
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    lazyQueue.forEach(fn => fn());
                    lazyQueue.length = 0;
                    obs.disconnect();
                }
            });
        }, { rootMargin: '200px' }); // preload leggermente prima che appaia

        observer.observe(node);
    }

    // Seleziona elementi principali da lazy-loadare
    const targetsSelector = [
        '#comments',
        '#secondary', // sidebar
        'ytd-reel-shelf-renderer', 
        'ytd-merch-shelf-renderer',
        'ytd-banner-promo-renderer',
        'ytd-rich-grid-renderer' // home / feed
    ];

    function attachLazyLoad() {
        targetsSelector.forEach(sel => {
            const node = document.querySelector(sel);
            if(node) lazyLoadNode(node);
        });
    }

    // Osservatore SPA: ricarica nodi quando cambia il video o la pagina
    const mutationObserver = new MutationObserver(attachLazyLoad);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Inizializzazione
    attachLazyLoad();

})();
