import { ethers } from 'ethers';
import { SEPOLIA_RPC } from '../../app/config';

const SepoliaProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC);

export default SepoliaProvider;
