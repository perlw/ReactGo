Duktape.modSearch = function (id) {
    print('loading module:', id);

    var src = loadModule(id);
    if (typeof src !== 'string') {
        throw new Error('module not found: ' + id);
    }

    return src;
};
