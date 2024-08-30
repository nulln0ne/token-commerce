import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumService {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly contract: ethers.Contract;

    constructor(private readonly configService: ConfigService) {
        const networkEndpoint = this.configService.get<string>('NETWORK_ENDPOINT');
        const contractAddress = '0xf117e28D8C9dEB52eDb3f10cFa2eA389d9873188';
        const contractAbi = [
            // Add the relevant parts of the ABI here, especially events like Transfer
            "event Transfer(address indexed from, address indexed to, uint256 value)"
        ];

        this.provider = new ethers.providers.JsonRpcProvider(networkEndpoint);
        this.contract = new ethers.Contract(contractAddress, contractAbi, this.provider);
    }

    async getTransactionHistory(walletAddress: string) {
        const filter = this.contract.filters.Transfer(walletAddress, null);
        const events = await this.contract.queryFilter(filter, 0, 'latest');
        return events.map(event => {
            return {
                from: event.args?.from,
                to: event.args?.to,
                value: event.args?.value.toString(),
                transactionHash: event.transactionHash,
            };
        });
    }
}
