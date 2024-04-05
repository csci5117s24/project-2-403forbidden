const { app } = require('@azure/functions');
const { type } = require('@testing-library/user-event/dist/type');
const mongoClient = require("mongodb").MongoClient;

app.http('newFirearm', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'firearm',
    handler: async (request) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const body = await request.json();

        const userid = body.userid ?? ""
        const firearmName = body.firearmName ?? "unknown name"
        const firearmType = body.firearmType ?? "unknown type"//pistol, revolver, shotgun, etc.
        const firearmMake = body.firearmMake ?? "unknown make"//Glock, CZ, etc.
        const firearmModel = body.firearmModel ?? "unknown model"//Glock19, Shadow2, etc.
        const firearmCaliber = body.firearmCaliber ?? "unknown caliber"//9mm, .45acp, etc. 
        const firearmPrice = body.firearmPrice ?? "" // $1000
        const firearmPurchasedate = body.firearmPurchasedate ?? "";

        const rangeVisitHistory = [];
        const maintenance = [];
        
        const payload = {
            userid: userid,
            firearmName: firearmName,
            firearmType: firearmType,
            firearmMake: firearmMake,
            firearmModel: firearmModel,
            firearmCaliber: firearmCaliber,
            firearmPrice: firearmPrice,
            firearmPurchasedate: firearmPurchasedate,
            rangeVisitHistory: rangeVisitHistory,
            maintenance: maintenance,
        }

        const result = await client.db("test").collection("firearm").insertOne(payload)


        client.close();
        return{
            status: 201, /* Defaults to 200 */
            jsonBody: {
                _id: result.insertedId, 
                userid: userid,
                firearmName: firearmName,
                firearmType: firearmType,
                firearmMake: firearmMake,
                firearmModel: firearmModel,
                firearmCaliber: firearmCaliber,
                firearmPrice: firearmPrice,
                firearmPurchasedate: firearmPurchasedate,
                rangeVisitHistory: rangeVisitHistory,
                maintenance: maintenance,
            }
        };
    },
});