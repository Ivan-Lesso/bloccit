const Flair = require("./models").Flair;

module.exports = {

  //#1
  getAllFlairs(callback) {
    return Flair.all()

  //#2
    .then((flairs) => {
      callback(null, flairs);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getFlairs(id, callback){
    return Flair.findById(id)
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },
  addFlair(newflair, callback){
    return Flair.create({
      name: newflair.name,
      color: newflair.color
    })
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },
  deleteFlair(id, callback){
    return Flair.destroy({
      where: {id}
    })
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateFlair(id, updatedFlairs, callback){
    return Flair.findById(id)
    .then((flair) => {
      if(!flair){
        return callback("flair not found");
      }

      flair.update(updatedFlairs, {
        fields: Object.keys(updatedFlairs)
      })
      .then(() => {
        callback(null, flair);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }
}
