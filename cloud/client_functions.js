Parse.Cloud.afterSave("Client", async (req) => {
  // return if the user role is admin
  if (req.user.get("appRole") === "admin") return;

  const Notification = Parse.Object.extend("Notification");
  const notif = new Notification();

  notif.set("for", "Client");
  notif.set("object", { objectId: req.object.id });
  notif.set("visited", false);
  await notif.save();
});

Parse.Cloud.define("getFinance", async (req) => {
  const { clientId } = req.params;
  //? get client parse object
  // const clientQuery = new Parse.Query("Client");
  // clientQuery.equalTo("objectId", clientId);
  // const clientObject = await clientQuery.first();

  //? get client blfs amount
  const blfQuery = new Parse.Query("Blf");
  let turnover = 0;
  let payments = 0;

  const turnoverResult = await blfQuery.aggregate([
    { match: { client: clientId } },
    { group: { objectId: null, turnover: { $sum: "$total" } } },
  ]);

  const paymentQuery = new Parse.Query("Payment");
  const paymentResult = await paymentQuery.aggregate([
    { match: { client: clientId } },
    { group: { objectId: null, payments: { $sum: "$amount" } } },
  ]);
  if (turnoverResult.length !== 0) {
    turnover = turnoverResult[0].turnover;
  }
  if (paymentResult.length !== 0) {
    payments = paymentResult[0].payments;
  }

  return { turnover, debt: turnover - payments };
});
