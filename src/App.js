import './App.css';
import { ethers } from 'hardhat';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DexAggregatorABI from './artifacts/src/contracts/DexAggregator.sol/DexAggregator.json'


function App() {
  const DexAggregatorAddress = "0xf342e904702b1d021f03f519d6d9614916b03f37"
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    checkIfWalletIsConnected();

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await checkIfWalletIsConnected();
      window.location.reload();
    })
  }, []);

  //Check if wallet is Connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          loadContracts();
        } else {
          console.log('Please Connect Your Wallet');
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        loadContracts();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //Load the DexAggregator Contract
  const loadContracts = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const dex = new ethers.Contract(
        DexAggregatorAddress,
        DexAggregatorABI.abi,
        signer
      );
      setContract(dex);

      // console.log(await signer.provider.getCode(marketplace))

      console.log('Contracts Loaded!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div>
      {/* TODO: super simplle ui 
          with text field to input the ammount of weth you want to swap 
          and it shows you your balance;
          
          
          */}
      <Navbar account={account} connectWallet={connectWallet} loading={loading} />
    </div>
  );
}

export default App;
