import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumService {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly deployer: ethers.Wallet;
    private readonly adminContract: ethers.Contract;

    constructor(private readonly configService: ConfigService) {
        const networkEndpoint = this.configService.get<string>('NETWORK_ENDPOINT');
        const privateKey = this.configService.get<string>('DEPLOYER_PRIVATE_KEY');
        const adminAddress = this.configService.get<string>('ADMIN_ADDRESS'); 

        if (!networkEndpoint || !privateKey || !adminAddress) {
            throw new InternalServerErrorException('Configuration for Ethereum provider is missing');
        }

        this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);

        this.deployer = new ethers.Wallet(privateKey, this.provider);

        const proxyAbi = [
            "function upgrade(address proxy, address implementation) external",
            "function getProxyImplementation(address proxy) external view returns (address)",
            "function getProxyAdmin(address proxy) external view returns (address)",
        ];

        this.adminContract = new ethers.Contract(adminAddress, proxyAbi, this.deployer);
    }

}
