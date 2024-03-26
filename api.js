import axios from 'axios';
import qs from 'qs'; 

const clientID = 's1fMOBco1GqCa43KDRrgA9O4QgI8jNCU';
const clientSecret = 'c5fl3yDso9lW8rzm';

//URL callback: https://zaldivarjoan.github.io/4220Midterm


/** This function will get the access tokens from the API using axios request call and the qs library to handle query strings for the credntials.
 * When everything is finished, it will return the tokens
*/

const getAccessToken = async () => {
  const data = qs.stringify({
    client_id: clientID,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  });

  try {
    const response = await axios.post('https://sandbox-api.digikey.com/v1/oauth2/token', data,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    const accessToken = response.data.access_token;
    //console.log(`Access Token: ${accessToken}`);
    return accessToken;
  } catch (error) {
    console.error(`Error in getAccessToken: ${error}`);
    return null;
  }
};

/** 
 * This function will take a user input string that is only up to 250 characters
 * It will then get authorization tokens to access the API. Once the it obtained the tokens
 * it will then make a request call to the POST search by keyword API. Finally returning products 
 * that are similar to the key words provided.
 */
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