import axios from 'axios';
import qs from 'qs'; // Make sure this package is installed with 'npm install qs'

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

// Call the function to get the access token
getAccessToken();