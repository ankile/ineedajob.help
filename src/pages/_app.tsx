import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import "react-tooltip/dist/react-tooltip.css";

import Navbar from "../components/Navbar";
import { UserProvider } from "../UserContext";

function App({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Navbar />
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default App;
