

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

export {
    isPermission,
};
