(function(){
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const url = typeof input === 'string' ? input : ((input && input.url) || '');
    if (/(^|\/)data\.json(?:[?#]|$)/i.test(url)) {
      const nonce = Date.now();
      const manifestResponse = await nativeFetch('data/manifest.json?v=' + nonce, { cache: 'no-store' });
      if (!manifestResponse.ok) throw new Error('Cannot load data/manifest.json');
      const manifest = await manifestResponse.json();
      const chunks = await Promise.all(manifest.files.map(async item => {
        const response = await nativeFetch('data/' + item.file + '?v=' + nonce, { cache: 'no-store' });
        if (!response.ok) throw new Error('Cannot load ' + item.file);
        return response.json();
      }));
      const combined = chunks.flat();
      return {
        ok: true, status: 200, statusText: 'OK', url: url,
        headers: new Headers({'Content-Type':'application/json'}),
        json: async () => combined,
        text: async () => JSON.stringify(combined),
        clone: function(){ return this; }
      };
    }
    return nativeFetch(input, init);
  };
})();