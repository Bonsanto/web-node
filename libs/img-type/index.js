const SUPPORTED_FORMATS = ["png", "jpe", "jpg", "jpeg", "jfif", "tif", "tiff", "gif", "bmp", "dib"];

exports.typeparser = function (file) {
	return file.split(".")[1];
};

exports.isAllowed = function (file) {
	return SUPPORTED_FORMATS.indexOf(file.split(".")[1]) > -1;
};