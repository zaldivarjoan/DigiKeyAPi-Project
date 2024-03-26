import axios from 'axios';
import qs from 'qs';

const clientID = 'pG8tbhx9QWVr3R28WID3th5QStGFgI7W';
const clientSecret = '21wvDBiWhGJ95Rqr';

//URL callback: https://zaldivarjoan.github.io/4220Midterm

const getAccessToken = async () => {
  const data = qs.stringify({
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  });

  try {
    const response = await axios.post('https://api.digikey.com/v1/oauth2/token', data,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    const accessToken = response.data.access_token;
    console.log(`Access Token: ${accessToken}`);
    return accessToken;
  } catch (error) {
    console.error(`Error in getAccessToken: ${error}`);
    return null;
  }
};

const searchByKeyword = async (keyword) =>{
  try{
      const tokens = await getAccessToken();
      const auth = `Bearer ${tokens}`;
      const data = JSON.stringify({
          'Keywords': keyword,
          'Limit': 10,
          'Offset': 0
      });

      const response =await axios.post('https://sandbox-api.digikey.com/products/v4/search/keyword', data,
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': auth,
                  'X-DIGIKEY-Client-Id': clientID,
                  'X-DIGIKEY-Locale-Site': 'US',
                  'X-DIGIKEY-Locale-Language': 'en',
                  'X-DIGIKEY-Locale-Currency': 'USD'
                  
              }
          }
      );

      console.log(response.data);
      return response.data;
  }
  catch(error){
      console.error('Error when searching by keyword', error);
  }
}

//getAccessToken();
searchByKeyword('Category');