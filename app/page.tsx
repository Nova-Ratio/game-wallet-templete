"use client";
// import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
    Abstraxion,
    useAbstraxionAccount,
    useAbstraxionSigningClient,
    useModal,
} from "@burnt-labs/abstraxion";
import { Button, Input } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Unity, useUnityContext } from "react-unity-webgl";

const seatContractAddress =
    "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka";

type ExecuteResultOrUndefined = ExecuteResult | undefined;
export default function Page(): JSX.Element {
    // Abstraxion hooks
    const { data: account } = useAbstraxionAccount();
    const { client, signArb, logout } = useAbstraxionSigningClient();

    // General state hooks
    const [, setShowModal]: [
        boolean,
        React.Dispatch<React.SetStateAction<boolean>>
    ] = useModal();

    const [loading, setLoading] = useState(false);

    const now = new Date();
    now.setSeconds(now.getSeconds() + 15);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const {
        unityProvider,
        loadingProgression,
        isLoaded,
        requestFullscreen,
        sendMessage,
        addEventListener,
        removeEventListener,
        unload,
    } = useUnityContext({
        loaderUrl: "", //
        dataUrl: "", //
        frameworkUrl: "", //
        codeUrl: "", //
        productName: "", //
        productVersion: "", //
        companyName: "", //
    });
    const CheckAuth = useCallback(() => {
        if (!account.bech32Address) {
            return;
        }
        sendMessage("Backend", "Connect", account.bech32Address);
    }, [account]);

    useEffect(() => {
        addEventListener("CheckAuth", CheckAuth);
        return () => {
            removeEventListener("CheckAuth", CheckAuth);
        };
    }, [addEventListener, removeEventListener, CheckAuth]);

    const forceLogout = useCallback(() => {
        if (!logout) return;
        unload();
        logout();
    }, []);

    useEffect(() => {
        addEventListener("ForceLogout", forceLogout);
        return () => {
            removeEventListener("ForceLogout", forceLogout);
        };
    }, [addEventListener, removeEventListener, forceLogout]);
    // const [devicePixelRatio, setDevicePixelRatio] = useState(
    //     window.devicePixelRatio
    // );

    // useEffect(
    //     function () {
    //         // A function which will update the device pixel ratio of the Unity
    //         // Application to match the device pixel ratio of the browser.
    //         const updateDevicePixelRatio = function () {
    //             setDevicePixelRatio(window.devicePixelRatio);
    //         };
    //         // A media matcher which watches for changes in the device pixel ratio.
    //         const mediaMatcher = window.matchMedia(
    //             `screen and (resolution: ${devicePixelRatio}dppx)`
    //         );
    //         // Adding an event listener to the media matcher which will update the
    //         // device pixel ratio of the Unity Application when the device pixel
    //         // ratio changes.
    //         mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    //         return function () {
    //             // Removing the event listener when the component unmounts.
    //             mediaMatcher.removeEventListener(
    //                 "change",
    //                 updateDevicePixelRatio
    //             );
    //         };
    //     },
    //     [devicePixelRatio]
    // );
    function handleFullscreen() {
        requestFullscreen(true);
    }

    return (
        <main className="m-auto flex min-h-screen max-w-l flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-2xl font-bold tracking-tighter text-white">
                Game Wallet Templete
            </h1>
            {account.bech32Address ? null : (
                <>
                    <Button
                        fullWidth
                        onClick={() => {
                            setShowModal(true);
                        }}
                        structure="base">
                        {account.bech32Address ? (
                            <div className="flex items-center justify-center">
                                VIEW ACCOUNT
                            </div>
                        ) : (
                            "CONNECT"
                        )}
                    </Button>
                </>
            )}
            {client ? (
                <>
                    <Button
                        fullWidth
                        onClick={handleFullscreen}
                        structure="base">
                        FULLSCREEN
                    </Button>
                    <Unity
                        unityProvider={unityProvider}
                        style={{
                            visibility: isLoaded ? "visible" : "hidden",
                            width: "100%",
                            height: "100%",
                            flex: 1,
                        }}
                        devicePixelRatio={devicePixelRatio}
                    />
                    {logout ? (
                        <Button
                            disabled={loading}
                            fullWidth
                            onClick={() => {
                                logout();
                            }}
                            structure="base">
                            LOGOUT
                        </Button>
                    ) : null}
                </>
            ) : null}
            <Abstraxion
                onClose={() => {
                    setShowModal(false);
                }}
            />
        </main>
    );
}
