

## setup sia node
https://skynet.helpdocs.io/article/vmmzyes1uy-skynet-sia-set-up
1. download sia daemon https://sia.tech/get-started
2. ./siad
3. ./siac wallet init 或者 ./siac wallet init-seed <existing-seed>

https://siasky.net/

https://skynet.helpdocs.io/article/3p9z5g9s0e-skynet-how-to



https://sia.tech/get-started

./siac skynet pin https://siasky.net/AAAzPabRrAMv9wBjLM0gxW9S2MZMuRP69KZY2EUCC9bFNQ "D:\apps\Sia-v1.4.4-windows-amd64\skynet\destination"

./siac skynet upload D:\apps\Sia-v1.4.4-windows-amd64\skynet\source D:\apps\Sia-v1.4.4-windows-amd64\skynet\destination


cd D:\apps\Sia-v1.4.4-windows-amd64

could not pin file to Skynet: 
[post call to /skynet/pin/AADanWbcLCSCWV4apHx_8V04w-e-bGOSwwYfqLsTThywbw?basechunkredundancy=0&force=false&root=false&siapath=D%3A%2Fapps%2FSia-v1.4.4-windows-amd64%2Fskynet failed; 
POST request error; Failed to pin file to Skynet: [unable to fetch base sector of skylink; cannot perform DownloadByRoot, no workers in worker pool

could not pin file to Skynet: [post call to /skynet/pin/https://siasky.net/AAAzPabRrAMv9wBjLM0gxW9S2MZMuRP69KZY2EUCC9bFNQ?basechunkredundancy=0&force=false&root=false&siapath=D%3A%2Fapps%2FSia-v1.4.4-windows-amd64%2Fskynet%2Fdestination failed; unable to perform POST on /skynet/pin/https://siasky.net/AAAzPabRrAMv9wBjLM0gxW9S2MZMuRP69KZY2EUCC9bFNQ?basechunkredundancy=0&force=false&root=false&siapath=D%3A%2Fapps%2FSia-v1.4.4-windows-amd64%2Fskynet%2Fdestination; API call not recognized]
PS D:\apps\Sia-v1.4.4-windows-amd64>