

var isPermission = (data, key) => {
    for (let index = 0; index < data.length; index++) {
        var object = data[index];
        if (object.id == key) {
            if (object.estado == 'A') {
                return true;
            }
            return false;
        }
    }
    return false;
};

const existeData = (data) => {
    return (typeof data != 'undefined' && data != null);
};

const esString = (data) => {
    return ((typeof data == 'string') && (typeof data != 'undefined'));
};

const esBoolean = (data) => {
    return (typeof data == 'boolean') ? data : false;
};

const esObject = (data) => {
    return (typeof data == 'object');
};

const esArray = (data) => {
    return (Array.isArray(data));
};


export {
    isPermission,
    existeData,
    esString,
    esBoolean,
    esObject,
    esArray,
};
