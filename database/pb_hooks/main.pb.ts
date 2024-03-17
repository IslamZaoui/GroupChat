/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap((e) => {
    console.log("Intellect DB initialized!")
})

onRealtimeAfterSubscribeRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && !record.get("isOnline")) {
        record.set("isOnline", true);
        $app.dao().saveRecord(record);
    }
})

onRealtimeDisconnectRequest((e) => {
    const record = e.client.get("authRecord")

    if (record && record.get("isOnline")) {
        record.set("isOnline", false);
        $app.dao().saveRecord(record);
    }
})