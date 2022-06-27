import React, { useEffect } from "react";
import logo from "./logo.svg";
import { Box, Button, Grommet } from "grommet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/dashboard";
import { BaseStyle } from "@hexhive/styles";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { AuthProvider } from "@hexhive/auth-ui";
import { getConfig } from "./actions/gateway";
import { HiveFlowConfiguration, HiveFlowProvider } from "./context";
import { createUploadLink } from 'apollo-upload-client'
import { buildAxiosFetch } from "@lifeomic/axios-fetch";
import axios from "axios";

const API_URL = localStorage.getItem('HEXHIVE_API');


const uploadLink = createUploadLink({
  uri:  process.env.NODE_ENV == 'production'
  ? `${API_URL || process.env.REACT_APP_API}/graphql`
  : "http://localhost:7000/graphql",

  headers: {
    "keep-alive": "true"
  },
  credentials: 'include',
  fetch: buildAxiosFetch(axios, (config, input, init) => ({
    ...config,
    withCredentials: true,
    onUploadProgress: (init as any)?.onUploadProgress
  }))
})


const authServer = process.env.REACT_APP_API
? `${process.env.REACT_APP_API}`
: "http://localhost:7000"

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

function App(props: any) {
  console.log("FLOW", window.location, process.env);

  console.log(BaseStyle);
  const { REACT_APP_API, PUBLIC_URL, REACT_APP_URL, NODE_ENV } = process.env;

  const [ config, setConfig ] = React.useState<HiveFlowConfiguration[]>([]);

  useEffect(() => {
    getConfig().then((data) => {
      setConfig(data.data.hiveApplianceConfigurations?.[0]?.permissions);
    })
  }, [])

  return (
    <HiveFlowProvider value={{config}}>
    <AuthProvider authorizationServer={authServer}>
      <Router basename={process.env.PUBLIC_URL || "/dashboard/flow"}>
        <Grommet
          theme={BaseStyle}
          style={{ display: "flex", width: "100vw", height: '100%' }}
          plain
        >
          <ThemeProvider theme={BaseStyle}>
            <ApolloProvider client={client}>
              <Routes>
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </ApolloProvider>
          </ThemeProvider>
        </Grommet>
      </Router>
    </AuthProvider>
    </HiveFlowProvider>
  );
}

export default App;
