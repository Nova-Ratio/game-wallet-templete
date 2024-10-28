"use client";

import { AbstraxionProvider } from '@burnt-labs/abstraxion';
import React from 'react'

const seatContractAddress = "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka";

function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Add Seat Address
    return (

        <AbstraxionProvider
            config={{
                contracts: [
                    seatContractAddress,
                    {
                        address: seatContractAddress,
                        amounts: [{ denom: "uxion", amount: "1000000" }],
                    },
                ],
                stake: true,
                bank: [
                    {
                        denom: "uxion",
                        amount: "1000000",
                    },
                ],
            }}
        >
            {children}
        </AbstraxionProvider>
    )
}

export default Providers
