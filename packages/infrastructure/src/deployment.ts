import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'
import { Config, Output, all } from '@pulumi/pulumi'

export const Deployment = async (provider: Provider, rootServer: string, dbUrl: Output<any>, dbPass: Output<any>) => {
    const config = new Config();

    let suffix = config.require('suffix');
    let imageTag = process.env.IMAGE_TAG 

    const appName = `hive-flow-${suffix}`;
    const appLabels = { appClass: appName };
   
    const deployment = new k8s.apps.v1.Deployment(`${appName}-dep`, {
        metadata: { labels: appLabels },
        spec: {
            replicas: 1,
            strategy: { type: "RollingUpdate" },
            selector: { matchLabels: appLabels },
            
            template: {
                metadata: { labels: appLabels },
                spec: {
                    
                    containers: [{
                        imagePullPolicy: "Always",
                        name: appName,
                        image: `thetechcompany/hiveflow-backend:${imageTag}`,
                        ports: [{ name: "http", containerPort: 9011 }],
                        volumeMounts: [
                        ],
                        env: [
                            // { name: 'CLIENT_ID', value: process.env.CLIENT_ID },
                            // { name: 'CLIENT_SECRET', value: process.env.CLIENT_SECRET },
                            { name: 'NODE_ENV', value: 'production' },
                            { name: 'ROOT_SERVER', value: `http://${rootServer}` },
                            { name: 'VERSION_SHIM', value: '1.0.5' },
                            { name: "DATABASE_URL", value: all([dbUrl, dbPass]).apply(([url, pass]) => `postgresql://postgres:${pass}@${url}.db-${suffix}.svc.cluster.local:5432/hiveflow`) },
                            { name: 'HEXHIVE_SECRET', value: process.env.HEXHIVE_SECRET },
                            { name: "BACKEND_URL", value: `http://hive-flow-prod-svc.default.svc.cluster.local/graphql`},
                            { name: "ENTRYPOINT", value: 'https://apps.hexhive.io/hiveflow-frontend/hexhive-apps-hive-flow.js' }
                            // { name: 'UI_URL',  value: `https://${domainName}/dashboard` },
                            // { name: 'BASE_URL',  value: `https://${domainName}`},
                            // { name: "NEO4J_URI", value: process.env.NEO4J_URI /*neo4Url.apply((url) => `neo4j://${url}.default.svc.cluster.local`)*/ },
                            // { name: "MONGO_URL", value: mongoUrl.apply((url) => `mongodb://${url}.default.svc.cluster.local`) },
                        ],
                        readinessProbe: {
                            httpGet: {
                                path: '/graphql',
                                port: 'http'
                            }
                        },
                        // livenessProbe: {
                        //     httpGet: {
                        //         path: '/graphql',
                        //         port: 'http'
                        //     }
                        // }
                    }],
                    // volumes: [{
                    //     name: `endpoints-config`,
                    //     configMap: {
                    //         name: configMap.metadata.name,
                    //         items: [{
                    //             key: 'endpoints',
                    //             path: 'endpoints.json'
                    //         }]
                    //     }
                    // }]
                }
            }
        },
    }, { provider: provider });

    return deployment
}
