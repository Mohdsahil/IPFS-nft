const { create } = require("ipfs-http-client")

async function ipfsClient() {
    try {
        const ipfs = await create(
            {
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
            }
        );
        return ipfs;
    } catch (error) {
        console.error(error)
    }
}

async function saveText() {
    try {
        let ipfs = await ipfsClient();

        let result = await ipfs.add(`welcome ${new Date()}`);
        console.log(result);
    } catch(error) {
        console.error(error)
    }
}

saveText()