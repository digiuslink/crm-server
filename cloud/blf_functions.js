Parse.Cloud.afterSave("Blf", async (req) => {
  // return if the user role is admin
  if (req.user.get("appRole") === "admin") return;

  const Notification = Parse.Object.extend("Notification");
  const notif = new Notification();

  notif.set("for", "Blf");
  notif.set("object", { objectId: req.object.id });
  notif.set("visited", false);
  await notif.save();
});

Parse.Cloud.define("countBlfs", async () => {
  const query = new Parse.Query("Blf");
  return await query.count();
});
