"use client";
import { ReactNode, createContext, useContext } from "react";

import useWhatsApps from "../../hooks/useWhatsApps";

interface PropsWhatsAppsContext {
  whatsApps: any;
  loading: boolean;
}

interface PropsWhatsProvider {
  children: ReactNode;
}

const WhatsAppsContext = createContext<PropsWhatsAppsContext>(
  {} as PropsWhatsAppsContext
);

function WhatsAppsProvider(props: PropsWhatsProvider) {
  const { children } = props;
  const { loading, whatsApps } = useWhatsApps();

  return (
    <WhatsAppsContext.Provider value={{ whatsApps, loading }}>
      {children}
    </WhatsAppsContext.Provider>
  );
}

function useAccessWhats() {
  return { ...useContext(WhatsAppsContext) };
}

export { WhatsAppsContext, WhatsAppsProvider, useAccessWhats };
