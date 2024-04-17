const { app } = require('@azure/functions');
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
    const uploadURL = await response.data.result.uploadURL; // Assuming the server responds with JSON
    console.log('Upload successful:', uploadURL);
    // Respond to the client indicating success
    return {
      jsonBody: {uploadURL: uploadURL}
    };
  },
});
app.http('newFirearm', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'firearm',
  handler: async (request) => {
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
      const body = await request.json();

      const authHeader = request.headers.get('X-MS-CLIENT-PRINCIPAL');
      let userid = "";
      if (authHeader) {
        token = Buffer.from(authHeader, "base64");
        token = JSON.parse(token.toString());
        userid = token.userId;
      }
      console.log("body",body)
      const firearmName = body.firearmName ?? "unknown name"
      const firearmType = body.firearmType ?? "unknown type"//pistol, revolver, shotgun, etc.
      const firearmMake = body.firearmMake ?? "unknown make"//Glock, CZ, etc.
      const firearmModel = body.firearmModel ?? "unknown model"//Glock19, Shadow2, etc.
      const firearmCaliber = body.firearmCaliber ?? "unknown caliber"//9mm, .45acp, etc. 
      const firearmPrice = body.firearmPrice ?? "" // $1000
      const firearmPurchasedate = body.firearmPurchasedate ?? "";
      const firearmImage = body.firearmImage ?? "";
      
      const payload = {
          userid: userid,
          firearmName: firearmName,
          firearmType: firearmType,
          firearmMake: firearmMake,
          firearmModel: firearmModel,
          firearmCaliber: firearmCaliber,
          firearmPrice: firearmPrice,
          firearmPurchasedate: firearmPurchasedate,
          firearmImage: firearmImage
      }
      console.log(payload)

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
              firearmImage: firearmImage
          }
      };
  },
});

//get based on user id
app.http('getFirearm', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'firearm',
  handler: async (request) => {
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
      
      const authHeader = request.headers.get('X-MS-CLIENT-PRINCIPAL');
      let userid = "";
      if (authHeader) {
        token = Buffer.from(authHeader, "base64");
        token = JSON.parse(token.toString());
        userid = token.userId;
      }
      
      const result = await client.db("test").collection("firearm").find({userid: userid}).toArray()
      client.close();
      return{
          status: 200, /* Defaults to 200 */
          jsonBody: result
      };
  },
});

//change based on user id
app.http('updateFirearm', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'firearm',
  handler: async (request) => {
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
      const body = await request.json();
      const userid = body.userid;
         
      const firearmName = body.firearmName ?? "unknown name"
      const firearmType = body.firearmType ?? "unknown type"//pistol, revolver, shotgun, etc.
      const firearmMake = body.firearmMake ?? "unknown make"//Glock, CZ, etc.
      const firearmModel = body.firearmModel ?? "unknown model"//Glock19, Shadow2, etc.
      const firearmCaliber = body.firearmCaliber ?? "unknown caliber"//9mm, .45acp, etc. 
      const firearmPrice = body.firearmPrice ?? "" // $1000
      const firearmPurchasedate = body.firearmPurchasedate ?? "";
      const firearmImage = body.firearmImage ?? "";
      const _id = body._id; 
      
      const payload = {
          userid: userid,
          firearmName: firearmName,
          firearmType: firearmType,
          firearmMake: firearmMake,
          firearmModel: firearmModel,
          firearmCaliber: firearmCaliber,
          firearmPrice: firearmPrice,
          firearmPurchasedate: firearmPurchasedate,
          firearmImage: firearmImage,
      }
      console.log(payload )

      const result = await client.db("test").collection("firearm").updateOne({_id: _id}, {$set: payload})
  }
});

//delete based on _id
app.http('deleteFirearm', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'firearm/{id}',
  handler: async (request) => {
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
      const _id = request.params.id;

      const result = await client.db("test").collection("firearm").deleteOne({_id: _id})
      client.close();
      return{
          status: 200, /* Defaults to 200 */
          jsonBody: {
              _id: _id
          }
      };
  }
});

app.http('newRangeVisit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'rangevisit/create',
    handler: async (request) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const body = await request.json();
  
        const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
        let userid = ""; // Initialize id with an empty string by default
  
        if (auth_header) {
            try {
                let token = Buffer.from(auth_header, "base64");
                token = JSON.parse(token.toString());
                if (token && token.userId) {
                  userid = token.userId;
                }
            } catch (error) {
                console.error("Error parsing the authentication token:", error);
            }
        }
        console.log(body);
        console.log("User ID:", userid);
  
        let visitDate = body.date ?? Date().toISOString()
        let rangeLat = body.lat ?? ""
        let rangeLng = body.lng ?? ""
        let visitDetail = body.detail ?? []
        let duration = body.duration ?? 60;
        
        const payload = {
          userid: userid,
          visitDate: visitDate,
          rangeLat: rangeLat,
          rangeLng: rangeLng,
          duration: duration,
          visitDetail: visitDetail,
          
        }
  
        const result = await client.db("test").collection("rangevisit").insertOne(payload)
  
        client.close();
        return{
            status: 201, /* Defaults to 200 */
            jsonBody: {
                _id: result.insertedId, 
                userid: userid,
                visitDate: visitDate,
                rangeLat: rangeLat,
                rangeLng: rangeLng,
                duration: duration,
                visitDetail: visitDetail,
            }
        };
    },
  });
  
  app.http('getRangeVisits', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'rangevisits/all',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const rangevisits = await client.db("test").collection("rangevisit").find({}).toArray()
        client.close();
        const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL')
        let token = null
        if (auth_header) {
            token = Buffer.from(auth_header, "base64");
            token = JSON.parse(token.toString());
            console.log(token.userId)
            return {
                jsonBody: {data: rangevisits.filter(rangevisit => rangevisit.userid === token.userId).reverse()}
            }
        } else {
            return {
                jsonBody: {data: rangevisits.reverse()}
            }
        }
    },
  });


