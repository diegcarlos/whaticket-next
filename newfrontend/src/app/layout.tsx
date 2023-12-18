import * as React from "react";

import Menu from "@/components/Menu";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { AuthProvider } from "@/context/AuthContext";
import { WhatsAppsProvider } from "@/context/WhatsApp/WhatsAppsContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Next.js App Router + Material UI v5",
  description: "Next.js App Router + Material UI v5",
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  const { children } = props;
  return (
    <html lang="en">
      <body style={{ minHeight: "100dvh", overflow: "hidden" }}>
        <ThemeRegistry>
          <AuthProvider>
            <WhatsAppsProvider>
              <Menu>{children}</Menu>
            </WhatsAppsProvider>
          </AuthProvider>
        </ThemeRegistry>
        <ToastContainer
          position="top-right"
          theme="colored"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}
