/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap((e) => {
    console.log("DB initialized!")
})

onRealtimeAfterSubscribeRequest((e) => {
    const record = e.client.get("authRecord")
    console.log(`User ${record?.get("username")} connected!`)

    if (record && !record.get("isOnline")) {
        record.set("isOnline", true);
        $app.dao().saveRecord(record);
    }
})

onRealtimeDisconnectRequest((e) => {
    const record = e.client.get("authRecord")
    console.log(`User ${record?.get("username")} disconnected!`)

    if (record && record.get("isOnline")) {
        record.set("isOnline", false);
        $app.dao().saveRecord(record);
    }
})