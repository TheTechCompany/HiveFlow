import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'
import { Config, Output, all } from '@pulumi/pulumi'

export const IntegrationDeployment = async (provider: Provider, rootServer: string, dbUrl: Output<any>, dbPass: Output<any>) => {
    const config = new Config();

    let suffix = config.require('suffix');
    let imageTag = process.env.IMAGE_TAG 

    const appName = `hiveflow-integration-${suffix}`;
    const appLabels = { appClass: appName };

    const sqlData = new k8s.core.v1.Secret(`${appName}-sql`, {
        stringData: {
            user: process.env.SQL_USER || '',
            password:  process.env.SQL_PASSWORD || ''
        }
    })
   
    const cronjob = new k8s.batch.v1.CronJob(`${appName}-cron`, {
        metadata: {
            labels: appLabels
        },
        spec: {
            schedule: '*/5 * * * *',
            jobTemplate: {
                spec: {
                    template: {
                        spec: {
                            nodeSelector: {
                                'eks.amazonaws.com/nodegroup': 'managed-nodes'                
                            },
                            containers: [
                                {
                                    imagePullPolicy: "IfNotPresent",
                                    name: appName,
                                    image: `thetechcompany/hiveflow-integration:${imageTag}`,
                                    env: [
                                        { name: "ROOT_URL", value: 'https://api.hexhive.io' },
                                        { name: "SQL_SERVER", value: process.env.SQL_SERVER},
                                        { name: "SQL_USER", valueFrom: { secretKeyRef: { key: 'user', name:  sqlData.metadata.name} } },
                                        { name: "SQL_PASSWORD", valueFrom: {secretKeyRef: {key: 'password', name: sqlData.metadata.name} } },
                                        { name: "SQL_TRUST_CERT", value: process.env.SQL_TRUST_CERT },
                                        { name: 'SQL_DB', value: process.env.SQL_DB},
                                        { name: 'API_KEY', value: process.env.INTEGRATION_KEY}
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    }, {
        provider
    })
    // const deployment = new k8s.apps.v1.Deployment(`${appName}-dep`, {
    //     metadata: { labels: appLabels },
    //     spec: {
    //         replicas: 1,
    //         strategy: { type: "RollingUpdate" },
    //         selector: { matchLabels: appLabels },
            
    //         template: {
    //             metadata: { labels: appLabels },
    //             spec: {
                    
    //                 containers: [{
    //                     imagePullPolicy: "IfNotPresent",
    //                     name: appName,
    //                     image: `thetechcompany/hiveflow-integration:${imageTag}`,
    //                     ports: [{ name: "http", containerPort: 9011 }],
    //                     volumeMounts: [
    //                     ],
    //                     env: [
    //                         // { name: 'CLIENT_ID', value: process.env.CLIENT_ID },
    //                         // { name: 'CLIENT_SECRET', value: process.env.CLIENT_SECRET },
    //                         { name: 'NODE_ENV', value: 'production' },
    //                         { name: 'ROOT_SERVER', value: `http://${rootServer}` },
    //                         { name: 'VERSION_SHIM', value: '1.0.5' },
    //                         { name: "DATABASE_URL", value: all([dbUrl, dbPass]).apply(([url, pass]) => `postgresql://postgres:${pass}@${url}.default.svc.cluster.local:5432/hiveflow`) },

    //                         // { name: 'UI_URL',  value: `https://${domainName}/dashboard` },
    //                         // { name: 'BASE_URL',  value: `https://${domainName}`},
    //                         // { name: "NEO4J_URI", value: process.env.NEO4J_URI /*neo4Url.apply((url) => `neo4j://${url}.default.svc.cluster.local`)*/ },
    //                         // { name: "MONGO_URL", value: mongoUrl.apply((url) => `mongodb://${url}.default.svc.cluster.local`) },
    //                     ],
    //                     readinessProbe: {
    //                         httpGet: {
    //                             path: '/graphql',
    //                             port: 'http'
    //                         }
    //                     },
    //                     // livenessProbe: {
    //                     //     httpGet: {
    //                     //         path: '/graphql',
    //                     //         port: 'http'
    //                     //     }
    //                     // }
    //                 }],
    //                 // volumes: [{
    //                 //     name: `endpoints-config`,
    //                 //     configMap: {
    //                 //         name: configMap.metadata.name,
    //                 //         items: [{
    //                 //             key: 'endpoints',
    //                 //             path: 'endpoints.json'
    //                 //         }]
    //                 //     }
    //                 // }]
    //             }
    //         }
    //     },
    // }, { provider: provider });

    return cronjob
}