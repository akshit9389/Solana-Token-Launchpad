import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { MINT_SIZE, TOKEN_2022_PROGRAM_ID, createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint} from "@solana/spl-token"
export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();
    async function createToken() {
        try {
           const mintKeypar = Keypair.generate()
           const lamports = getMinimumBalanceForRentExemptMint(connection)
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypar.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID
                }),
                createInitializeMint2Instruction(
                    mintKeypar.publicKey,
                    9,
                    wallet.publicKey,
                    wallet.publicKey,
                    TOKEN_2022_PROGRAM_ID
                )
            );
            transaction.feePayer = wallet.publicKey
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            transaction.partialSign(mintKeypar)
            const sign = await wallet.sendTransaction(transaction, connection)
            await connection.confirmTransaction(sign, "confirm")
            alert(`✅ Token mint created at ${mintKeypar.publicKey.toBase58()}`)
        }
        catch (e) {
            alert("❌ Error creating token mint:", error);
       }
    }
    return  <div style={{
        height: '100vh',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button className='btn' onClick={createToken}>Create a token</button>
    </div>
}