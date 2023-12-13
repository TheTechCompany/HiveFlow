import React, { useEffect } from "react";
import logo from "./logo.svg";
import { Box, Button, Grommet } from "grommet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Dashboard } from "./views/dashboard";
import { HexHiveTheme } from "@hexhive/styles";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
// import { ThemeProvider } from "styled-components";
import { AuthProvider } from "@hexhive/auth-ui";
import { getConfig } from "./actions/gateway";
import { HiveFlowConfiguration, HiveFlowProvider } from "./context";
import { createUploadLink } from 'apollo-upload-client'
import { buildAxiosFetch } from "@lifeomic/axios-fetch";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const API_URL = localStorage.getItem('HEXHIVE_API');

const uploadLink = createUploadLink({
  uri: process.env.NODE_ENV == 'production'
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


const globalTheme = createTheme({
  palette: {
    primary: {
      light: '#fff8f2',
      main: '#72738b'
    },
    secondary: {
      // light: '#a3b579',
      main: "#87927e"
    }
  }
})

export const theme = createTheme({
  palette: {
    ...globalTheme.palette
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: globalTheme.palette.primary.light,
          borderRadius: '6px',
          overflow: "hidden"
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: globalTheme.palette.secondary.main
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '36px',
        },
        indicator: {
          // background: globalTheme.palette.navigation.main
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: '6px',
          // color: globalTheme.palette.navigation.main,
          minHeight: '36px',

          '&.Mui-selected': {
            // color: globalTheme.palette.navigation.main

          }
        }

      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '6px'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '6px',
          paddingTop: '6px'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: globalTheme.palette.secondary.main,
          color: '#fff',
          padding: '6px',
          fontSize: '16px',
          marginBottom: '6px'
        }
      }
    }
  }
  // palette: {
  //   // primary: {
  //   //   main: '',
  //   // },
  //   // secondary: {
  //   //   main: ''
  //   // }
  // }
});

function App(props: any) {
  console.log("FLOW", window.location, process.env);

  const { REACT_APP_API, PUBLIC_URL, REACT_APP_URL, NODE_ENV } = process.env;

  const [config, setConfig] = React.useState<HiveFlowConfiguration[]>([]);

  useEffect(() => {
    getConfig().then((data) => {
      setConfig(data.data.hiveApplianceConfigurations?.[0]?.permissions);
    })
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={HexHiveTheme}>

        <HiveFlowProvider value={{ config }}>
          <AuthProvider authorizationServer={authServer}>
            <Router basename={process.env.PUBLIC_URL || "/dashboard/flow"}>

              <ApolloProvider client={client}>
                <Routes>
                  <Route path="*" element={<Dashboard />} />
                </Routes>

              </ApolloProvider>

            </Router>
          </AuthProvider>
        </HiveFlowProvider>
      </ThemeProvider>
    </LocalizationProvider>

  );
}

export default App;
