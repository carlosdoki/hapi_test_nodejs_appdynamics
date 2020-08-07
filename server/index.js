'use strict';

const Glue = require('@hapi/glue');
const Manifest = require('./manifest');
require("appdynamics").profile({
  controllerHostName: "ec2-52-13-44-12.us-west-2.compute.amazonaws.com",
  controllerPort: 8090,
  controllerSslEnabled: false, // Set to true if controllerPort is SSL
  accountName: "customer1",
  accountAccessKey: "16ff4175-95c7-4c2f-807d-fb083e398055", //required
  applicationName: "Teste_node_Hapi",
  tierName: "backend",
  nodeName: "doki",
  reuseNode: true,
  reuseNodePrefix: "hub-precos-export",
  noNodeNameSuffix: false,
  logging: {
    logfiles: [
      {
        root_directory:
          "/tmp/appd",
        filename: "echo_%N.log",
        level: "DEBUG",
        max_size: 5242880,
        max_files: 10,
        // outputType: "console", // Set this parameter if you want to log to STDOUT/STDERR. Omit this parameter if you want to log to a file.
      },
    ],
  },
});
exports.deployment = async (start) => {

    const manifest = Manifest.get('/');
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    await server.initialize();

    if (!start) {
        return server;
    }

    await server.start();

    console.log(`Server started at ${server.info.uri}`);

    return server;
};

if (!module.parent) {

    exports.deployment(true);

    process.on('unhandledRejection', (err) => {

        throw err;
    });
}
