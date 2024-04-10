import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

function App() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [transactionData, setTransactionData] = useState([]);
  const [showData, setShowData] = useState(false)


  useEffect(() => {
    // Check if auth token exists in local storage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setAuthToken(storedToken);
      fetchData(storedToken);
    }
  }, []);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('https://adminrana.papayacoders.in/ownerapi/v1/getAgents', {
        params: {
          from_date: '2024-01-20',
          to_date: '2024-03-21',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("ressss", response.data)
        setTransactionData(response.data.data);
        console.log("trrr", transactionData)
        setShowData(true)
      } else {
        throw new Error('Failed to fetch transaction data');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch transaction data');
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://adminrana.papayacoders.in/ownerapi/v1/otp-login', {
        mobile: number,
      });

      if (response.status === 200) {
        setShowOtpInput(true);
        toast.success('OTP is sent to your mobile number');
      } else {
        throw new Error('Failed to submit mobile number');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit mobile number');
    }
  };

  const handleOnVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://adminrana.papayacoders.in/ownerapi/v1/verify-otp', {
        mobile: number,
        otp: otp,
      });

      if (response.status === 200) {
        localStorage.setItem('authToken', response.data.message);
        setAuthToken(response.data.message);
        toast.success('OTP verification successful');

        fetchData(response.data.message);
      } else {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to verify OTP');
    }
  };

  return (
    <div>
      {!showData ?
        <form>
          <label>Mobile number</label>
          <br />
          {!showOtpInput ? (
            <>
              <input
                type="tel"
                placeholder="Please enter your mobile number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <button onClick={handleOnSubmit}>Submit</button>
            </>
          ) : (
            <>
              <input
                type="number"
                placeholder="Please enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleOnVerify}>Verify</button>
            </>
          )}
        </form>
        :
        <div>{transactionData.length > 0 && (

          <>
            <h2>Transaction Data</h2>
            <ul>
              {transactionData.map((transaction, index) => (
                <li key={index}>{transaction.name}</li>
              ))}
            </ul>
          </>

        )}
        </div>}

    </div>
  );
}

export default App;
