const regexUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/;
const regexUrlVideo = /https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\\-]))?/;
module.exports = {
  regexUrl,
  regexUrlVideo,
};
