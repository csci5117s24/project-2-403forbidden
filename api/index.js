const { app } = require('@azure/functions');
const { type } = require('@testing-library/user-event/dist/type');
const mongoClient = require("mongodb").MongoClient;
const axios = require('axios');
const FormData = require('form-data');

app.http('validateCloudFlare', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'validate',
    handler: async (request, context) => {
      try {
        // Make a GET request to the CloudFlare API to verify the token
        const response = await axios.get('https://api.cloudflare.com/client/v4/user/tokens/verify', {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, // Replace with secure token access
            'Content-Type': 'application/json'
          }
        });
  
        console.log(response.data);
        // Process the response from CloudFlare API
        if (response.data && response.data.success) {
          // Token is valid, proceed with your logic
          return {
            success: true,
            message: 'CloudFlare token validated successfully.'
          };
        } else {
          // Token is invalid or verification failed
          return {
            success: false,
            message: 'Failed to validate CloudFlare token.'
          };
        }
      } catch (error) {
        // Handle potential errors
        console.error('Error validating CloudFlare token:', error);
        return {
          success: false,
          message: 'An error occurred during CloudFlare token validation.'
        };
      }
    },
});
  
app.http('uploadImageToCloudFlare', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload',
    handler: async (request, context) => {
    const body = await request.json();
    const imageUrl = body.imageUrl;
    console.log(imageUrl);
    console.log("Here");
    if (!imageUrl) {
        console.log("No imageURL");
        return {
        success: false,
        message: 'No image URL provided.'
        };
    }


    console.log("Have imageURL");
    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('metadata', JSON.stringify({ key: 'value' })); // Adjust the metadata as necessary
    formData.append('requireSignedURLs', 'false');

    try {
        const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, formData, {
        headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, // Replace <API_TOKEN> with your actual Cloudflare API token
        },
        });

        // Process the response from CloudFlare
        if (response.data && response.data.success) {
        // Image upload was successful
        return {
            jsonBody: {
                success: true,
                message: 'Image uploaded successfully to CloudFlare.',
                imageURL: response.data.result.variants[0]
            }
        };
        } else {
        // Upload failed
        return {
            success: false,
            message: 'Failed to upload image to CloudFlare.'
        };
        }
    } catch (error) {
        // Handle potential errors
        console.error('Error uploading image to CloudFlare:', error);
        return {
        success: false,
        message: 'An error occurred during image upload to CloudFlare.'
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