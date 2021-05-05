const index = require('./index');

async function localTest() {
    process.env.API_ENDPOINT = 'https://2m4ncx4jdf.execute-api.us-east-1.amazonaws.com/prod/';
    let event = {
        PrevOrderId: '376aa1ec-9185-4088-ad70-5af2f96f23d6'
    }
    await index.handler(event);
}

localTest();