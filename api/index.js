const { app } = require('@azure/functions');
const { type } = require('@testing-library/user-event/dist/type');
const mongoClient = require("mongodb").MongoClient;
const axios = require('axios');
const FormData = require('form-data');

app.http('obtainCloudFlareUploadURL', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'getuploadurl',
  handler: async (request, context) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`;
    const formData = new FormData();
    formData.append('metadata', JSON.stringify({ key: 'value' }));
    formData.append('requireSignedURLs', 'false');

    try {
      const response = await axios.post(url, formData, {
      headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, // Replace <API_TOKEN> with your actual Cloudflare API token
      },
      });

      if (response.statusText !== "OK") {
        console.log(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response.data);
      const uploadURL = await response.data.result.uploadURL; // Assuming the server responds with JSON
      console.log('Upload successful:', uploadURL);
      // Respond to the client indicating success
      return {
        jsonBody: {uploadURL: uploadURL}
      };
    } catch (error) {
      console.error('Upload failed:', error);
      // Respond to the client indicating failure
      return {
        success: false,
        message: `An error occurred during the image upload: ${error.message}`
      };
    }
  },
});

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