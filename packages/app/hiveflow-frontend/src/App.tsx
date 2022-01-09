import React from "react";
import logo from "./logo.svg";
import { Box, Button, Grommet } from "grommet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/dashboard";
import { BaseStyle } from "@hexhive/styles";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { AuthProvider } from "@hexhive/auth-ui";


const authServer = process.env.REACT_APP_API
? `${process.env.REACT_APP_API}`
: "http://localhost:7000"

const client = new ApolloClient({
  uri: process.env.REACT_APP_API
    ? `${process.env.REACT_APP_API}/graphql`
    : "http://localhost:7000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function App(props: any) {
  console.log("FLOW", window.location, process.env);

  console.log(BaseStyle);
  const { REACT_APP_API, PUBLIC_URL, REACT_APP_URL, NODE_ENV } = process.env;

  return (
    <AuthProvider authorizationServer={authServer}>
      <Router basename={process.env.PUBLIC_URL || "/dashboard/flow"}>
        <Grommet
          theme={BaseStyle}
          style={{ display: "flex", width: "100%", height: "100%" }}
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
  );
}

export default App;
