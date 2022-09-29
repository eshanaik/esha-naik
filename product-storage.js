var plugin = function (options) {
  var seneca = this;

  seneca.add({ role: "pro", cmd: "add" }, function (print, respond) {
    this.make("pro").data$(print.data).save$(respond);
  });

  seneca.add({ role: "pro", cmd: "get-all" }, function (print, respond) {
    this.make("pro").list$({}, respond);
  });

  seneca.add({ role: "pro", cmd: "delete" }, function (print, respond) {
    this.make("pro").remove$(print.id, respond);
  });
};

module.exports = plugin;
